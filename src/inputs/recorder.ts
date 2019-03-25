import {ArrayUtil} from '../utils/array-util'
import {Input} from './input'
import {InputBit} from './input-bit'
import {InputSet} from './input-set'
import {ObjectUtil} from '../utils/object-util'

/** record(), update(), read (active(), trigger()) in that order. */
export class Recorder {
  /** The maximum duration in milliseconds permitted between combo inputs. */
  private static _maxInterval: number = 256

  constructor(
    /** The time in milliseconds since the input changed. When zero, the input
        is triggered. When exceeded, the combo is reset (either to the active
        input or empty). */
    private _timer: number = 0,
    /** The current recording and prospective combo member. The last input
        overwrites any previous. A zero value can never be a combo member but is
        necessary to persist in _input and _lastInput to distinguish the off
        state between repeated button presses like [UP, UP]. Starts empty after
        each update. */
    private _set: Mutable<InputSet> = {},
    /** The previous recording but not necessarily a combo member. */
    private _lastSet: InputSet = {},
    /** A sequence of nonzero input sets ordered from oldest (first) to latest
        (last). Combos are terminated only by expiration. */
    private readonly _combo: InputSet[] = []
  ) {}

  /** @param combo A sequence of one or more InputBits. */
  equal(...combo: InputBit[]): boolean {
    return this.active(true, combo)
  }

  set(...combo: InputBit[]): boolean {
    return this.active(false, combo)
  }

  /** Identical to active() but only true if combo is new. */
  triggered(...combo: InputBit[]): boolean {
    return !this._timer && this.equal(...combo)
  }

  triggeredSet(...combo: InputBit[]): boolean {
    return !this._timer && this.set(...combo)
  }

  combo(): ReadonlyArray<InputSet> {
    return this._combo
  }

  record(input: Input): void {
    this._set[input.source] = <any>input
  }

  /** Update the combo with recorded input. */
  update(milliseconds: number): void {
    const interval = this._timer + milliseconds
    const bits = this._toBits(this._set)
    const lastBits = this._toBits(this._lastSet)

    if (interval >= Recorder._maxInterval && (!bits || bits !== lastBits)) {
      // Expired and released or changed.
      this._timer = 0
      this._combo.length = 0
      // If active and changed, start a new combo.
      if (bits) this._combo.push(this._set)
    } else if (bits && bits !== lastBits) {
      // Unexpired active and changed (triggered).
      this._timer = 0
      // Input is now part of a combo and will not be modified by _lastInput.
      this._combo.push(this._set)
    } else {
      // Held, possibly expired, or unexpired and released.
      this._timer = interval

      if (bits && bits === lastBits) {
        // Held, update combo with the latest input.
        this._combo.pop()
        this._combo.push(this._set)
      }
    }

    // Input is now last input and will not be be modified. Next input starts
    // empty. No carryovers.
    this._lastSet = this._set
    this._set = {}
  }

  private active(exact: boolean, combo: InputBit[]): boolean {
    const offset = this._combo.length - combo.length
    if (offset < 0) return false
    // Test from offset to allow subsets. E.g., [DOWN] matches [UP, DOWN].
    return combo.every(
      (bits, i) =>
        ((exact ? ~0 : bits) & this._toBits(this._combo[offset + i])) === bits
    )
  }

  /** Coalesces and returns the bits for the inputs at combo index. A set bit
      from any source overrides an unset bit from any other. */
  private _toBits(set: InputSet): InputBit {
    const inputs = ObjectUtil.keys(set).map(source => set[source])
    return inputs.filter(ArrayUtil.is).reduce((sum, {bits}) => sum | bits, 0)
  }
}
