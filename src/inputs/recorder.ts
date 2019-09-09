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
type t = Recorder

/** record(), update(), read (active(), trigger()) in that order. */
export namespace Recorder {
  export const make = (): t => ({timer: 0, set: {}, lastSet: {}, combo: []})

  /** @arg combo A sequence of one or more InputBits. */
  export const equal = (val: t, ...combo: readonly InputBit[]): boolean =>
    active(val, true, combo)

  export const set = (val: t, ...combo: readonly InputBit[]): boolean =>
    active(val, false, combo)

  /** Identical to active() but only true if combo is new. */
  export const triggered = (val: t, ...combo: readonly InputBit[]): boolean =>
    !val.timer && equal(val, ...combo)

  export const triggeredSet = (
    val: t,
    ...combo: readonly InputBit[]
  ): boolean => !val.timer && set(val, ...combo)

  export const record = (val: t, input: Input): void =>
    (val.set[input.source] = <any>input)

  /** Update the combo with recorded input. */
  export const update = (val: Mutable<t>, milliseconds: number): void => {
    const interval = val.timer + milliseconds
    const bits = InputSet.bits(val.set)
    const lastBits = InputSet.bits(val.lastSet)

    if (interval >= maxInterval && (!bits || bits !== lastBits)) {
      // Expired and released or changed.
      val.timer = 0
      val.combo.length = 0
      // If active and changed, start a new combo.
      if (bits) val.combo.push(val.set)
    } else if (bits && bits !== lastBits) {
      // Unexpired active and changed (triggered).
      val.timer = 0
      // Input is now part of a combo and will not be modified by _lastInput.
      val.combo.push(val.set)
    } else {
      // Held, possibly expired, or unexpired and released.
      val.timer = interval

      if (bits && bits === lastBits) {
        // Held, update combo with the latest input.
        val.combo.pop()
        val.combo.push(val.set)
      }
    }

    // Input is now last input and will not be be modified. Next input starts
    // empty. No carryovers.
    val.lastSet = val.set
    val.set = {}
  }
}

const active = (
  val: t,
  exact: boolean,
  combo: readonly InputBit[]
): boolean => {
  // Test from offset to allow subsets. E.g., [DOWN] matches [UP, DOWN].
  const offset = val.combo.length - combo.length
  if (offset < 0) return false
  if (
    ((exact ? ~0 : combo.slice(-1)[0]) & InputSet.bits(val.lastSet)) !==
    combo.slice(-1)[0]
  ) {
    return false
  }
  return combo.every(
    (bits, i) =>
      ((exact ? ~0 : bits) & InputSet.bits(val.combo[offset + i])) === bits
  )
}
