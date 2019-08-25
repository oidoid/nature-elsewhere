import {Input} from './input'
import {InputBit} from './input-bit'
import {InputSet} from './input-set'

/** The maximum duration in milliseconds permitted between combo inputs. */
const maxInterval: number = 255

export interface Recorder {
  /** The time in milliseconds since the input changed. When zero, the input
      is triggered. When exceeded, the combo is reset (either to the active
      input or empty). */
  readonly timer: number
  /** The current recording and prospective combo member. The last input
      overwrites any previous. A zero value can never be a combo member but is
      necessary to persist in set and lastSet to distinguish the off state
      between repeated button presses like [UP, UP]. Starts empty after each
      update. */
  readonly set: Mutable<InputSet>
  /** The previous recording but not necessarily a combo member. */
  readonly lastSet: InputSet
  /** A sequence of nonzero input sets ordered from oldest (first) to latest
      (last). Combos are terminated only by expiration. */
  readonly combo: InputSet[]
}

/** record(), update(), read (active(), trigger()) in that order. */
export namespace Recorder {
  export function make(): Recorder {
    return {timer: 0, set: {}, lastSet: {}, combo: []}
  }

  /** @arg combo A sequence of one or more InputBits. */
  export function equal(
    state: Recorder,
    ...combo: readonly InputBit[]
  ): boolean {
    return active(state, true, combo)
  }

  export function set(state: Recorder, ...combo: readonly InputBit[]): boolean {
    return active(state, false, combo)
  }

  /** Identical to active() but only true if combo is new. */
  export function triggered(
    state: Recorder,
    ...combo: readonly InputBit[]
  ): boolean {
    return !state.timer && equal(state, ...combo)
  }

  export function triggeredSet(
    state: Recorder,
    ...combo: readonly InputBit[]
  ): boolean {
    return !state.timer && set(state, ...combo)
  }

  export function record(state: Recorder, input: Input): void {
    state.set[input.source] = <any>input
  }

  /** Update the combo with recorded input. */
  export function update(state: Mutable<Recorder>, milliseconds: number): void {
    const interval = state.timer + milliseconds
    const bits = InputSet.bits(state.set)
    const lastBits = InputSet.bits(state.lastSet)

    if (interval >= maxInterval && (!bits || bits !== lastBits)) {
      // Expired and released or changed.
      state.timer = 0
      state.combo.length = 0
      // If active and changed, start a new combo.
      if (bits) state.combo.push(state.set)
    } else if (bits && bits !== lastBits) {
      // Unexpired active and changed (triggered).
      state.timer = 0
      // Input is now part of a combo and will not be modified by _lastInput.
      state.combo.push(state.set)
    } else {
      // Held, possibly expired, or unexpired and released.
      state.timer = interval

      if (bits && bits === lastBits) {
        // Held, update combo with the latest input.
        state.combo.pop()
        state.combo.push(state.set)
      }
    }

    // Input is now last input and will not be be modified. Next input starts
    // empty. No carryovers.
    state.lastSet = state.set
    state.set = {}
  }
}

function active(
  state: Recorder,
  exact: boolean,
  combo: readonly InputBit[]
): boolean {
  // Test from offset to allow subsets. E.g., [DOWN] matches [UP, DOWN].
  const offset = state.combo.length - combo.length
  if (offset < 0) return false
  if (
    ((exact ? ~0 : combo.slice(-1)[0]) & InputSet.bits(state.lastSet)) !==
    combo.slice(-1)[0]
  ) {
    return false
  }
  return combo.every(
    (bits, i) =>
      ((exact ? ~0 : bits) & InputSet.bits(state.combo[offset + i])) === bits
  )
}
