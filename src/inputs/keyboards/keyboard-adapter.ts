import {InputBit} from '../input-bit'
import {InputSource} from '../input-source'
import {KeyboardInput} from './keyboard-input'

/** Converts an Event-based active / inactive input, keydown / keyup, to a
    polled input. Without this adapter, the Recorder must track which inputs to
    persist (roll over to prime the next sample) every update loop which
    complicates its logic. When all inputs are polled like Gamepad, the Recorder
    can safely start with a zeroed sample each loop since any carryover status
    will be provided by the underlying adapters. Bits persist until cleared by
    reset or keyup. If a bit is set and unset in the same frame, it is lost. */
export class KeyboardAdapter {
  private _bits: InputBit = 0

  adapt(bit: InputBit, active: boolean): void {
    if (active) {
      this._bits |= bit
    } else {
      this._bits &= ~bit
    }
  }

  toInput(): KeyboardInput {
    return {source: InputSource.KEYBOARD, bits: this._bits}
  }

  reset(): void {
    this._bits = 0
  }
}
