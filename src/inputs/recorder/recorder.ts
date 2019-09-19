import {Input} from '../input'
import {InputBit} from '../input-bit/input-bit'
import {InputSet} from '../input-set'

export interface Recorder {
  /** The maximum duration in milliseconds permitted between combo inputs. */
  readonly maxInterval: Milliseconds
  /** The time in milliseconds since the input changed. When zero, the input
      is triggered. When exceeded, the combo is reset (either to the active
      input or empty). */
  readonly timer: Milliseconds
  /** The current recording and prospective combo member. The last input
      overwrites any previous. A zero value can never be a combo member but is
      necessary to persist in set and lastSet to distinguish the off state
      between repeated button presses like [UP, UP]. Starts empty after each
      update. */
  readonly set: Writable<InputSet>
  /** The previous recording but not necessarily a combo member. */
  readonly lastSet: InputSet
  /** A sequence of nonzero input sets ordered from oldest (first) to latest
      (last). Combos are terminated only by expiration. */
  readonly combo: InputSet[]
}

/** record(), update(), read (active(), trigger()) in that order. */
export namespace Recorder {
  export function make(maxInterval: Milliseconds): Recorder {
    return {
      maxInterval,
      timer: 0,
      set: {},
      lastSet: {},
      combo: []
    }
  }

  /** @arg combo A sequence of one or more InputBits. */
  export function equal(
    recorder: Recorder,
    ...combo: readonly InputBit[]
  ): boolean {
    return active(recorder, true, combo)
  }

  export function set(
    recorder: Recorder,
    ...combo: readonly InputBit[]
  ): boolean {
    return active(recorder, false, combo)
  }

  /** Identical to active() but only true if combo is new. */
  export function triggered(
    recorder: Recorder,
    ...combo: readonly InputBit[]
  ): boolean {
    return !recorder.timer && equal(recorder, ...combo)
  }

  export function triggeredSet(
    recorder: Recorder,
    ...combo: readonly InputBit[]
  ): boolean {
    return !recorder.timer && set(recorder, ...combo)
  }

  export function record(recorder: Recorder, input: Input): void {
    return (recorder.set[input.source] = <any>input)
  }

  /** Update the combo with recorded input. */
  export function update(
    recorder: Writable<Recorder>,
    time: Milliseconds
  ): void {
    const interval = recorder.timer + time
    const bits = InputSet.bits(recorder.set)
    const lastBits = InputSet.bits(recorder.lastSet)

    if (interval >= recorder.maxInterval && (!bits || bits !== lastBits)) {
      if (bits) debugger
      // Expired and released or changed.
      recorder.timer = 0
      recorder.combo.length = 0
      // If active and changed, start a new combo.
      if (bits) recorder.combo.push(recorder.set)
    } else if (bits && bits !== lastBits) {
      debugger
      // Unexpired active and changed (triggered).
      recorder.timer = 0
      // Input is now part of a combo and will not be modified by _lastInput.
      recorder.combo.push(recorder.set)
    } else {
      // Held, possibly expired, or unexpired and released.
      recorder.timer = interval

      if (bits && bits === lastBits) {
        // Held, update combo with the latest input.
        recorder.combo.pop()
        recorder.combo.push(recorder.set)
      }
    }

    // Input is now last input and will not be be modified. Next input starts
    // empty. No carryovers.
    recorder.lastSet = recorder.set
    recorder.set = {}
  }
}

function active(
  recorder: Recorder,
  exact: boolean,
  combo: readonly InputBit[]
): boolean {
  // Test from offset to allow subsets. E.g., [DOWN] matches [UP, DOWN].
  const offset = recorder.combo.length - combo.length
  if (offset < 0) return false
  if (
    ((exact ? ~0 : combo.slice(-1)[0]) & InputSet.bits(recorder.lastSet)) !==
    combo.slice(-1)[0]
  ) {
    return false
  }
  return combo.every(
    (bits, i) =>
      ((exact ? ~0 : bits) & InputSet.bits(recorder.combo[offset + i])) === bits
  )
}
