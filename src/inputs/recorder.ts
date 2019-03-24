import {Input} from './input'
import {InputBit} from './input-bit'
import {InputSource} from './input-source'
import {ObjectUtil} from '../utils/object-util'

type InputSet = Readonly<Record<InputSource, Input>>

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
    private _input: Mutable<InputSet> = <InputSet>{},
    /** The previous recording but not necessarily a combo member. */
    private _lastInput: InputSet = <InputSet>{},
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
    this._input[input.source] = input
  }

  /** Update the combo with recorded input. */
  update(milliseconds: number): void {
    const interval = this._timer + milliseconds
    const bits = this._toBits(this._input)
    const lastBits = this._toBits(this._lastInput)

    if (interval >= Recorder._maxInterval && (!bits || bits !== lastBits)) {
      // Expired and changed.
      this._timer = 0
      this._combo.length = 0
      // Start a new combo.
      if (bits) this._combo.push(this._input)
    } else if (bits && bits !== lastBits) {
      // Active and changed (triggered) nonzero.
      this._timer = 0
      // Input is now part of a combo and will not be modified by _lastInput.
      this._combo.push(this._input)
    } else {
      // Held, possibly expired, or unchanged and unexpired.
      this._timer = interval

      if (bits && bits === lastBits) {
        // Update combo with the latest input.
        this._combo.pop()
        this._combo.push(this._input)
      }
    }

    // Input is now last input and will not be be modified. Next input starts
    // empty. No carryovers.
    this._lastInput = this._input
    this._input = <InputSet>{}
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
    return inputs.reduce((sum, {bits}) => sum | bits, 0)
  }
}
