import * as defaultKeyboardMap from '../../assets/inputs/default-keyboard-map.json'
import {InputBit} from '../input-bit'

type Key = KeyboardEvent['key']
type KeyMap = Readonly<Partial<Record<Key, InputBit.Key>>>

export namespace KeyboardRecorder {
  /** Call this function when a keydown or keyup KeyboardEvent is received. */
  export function onKey(bits: InputBit, event: KeyboardEvent): InputBit {
    const bit = (<KeyMap>defaultKeyboardMap)[event.key]
    if (bit === undefined) return bits
    event.preventDefault()
    return adapt(bits, InputBit[bit], event.type === 'keydown')
  }
}

/** Converts an Event-based active / inactive input, keydown / keyup, to a
    polled input. Without this adapter, the Recorder must track which inputs to
    persist (roll over to prime the next sample) every update loop which
    complicates its logic. When all inputs are polled like Gamepad, the Recorder
    can safely start with a zeroed sample each loop since any carryover status
    will be provided by the underlying adapters. Bits persist until cleared by
    reset or keyup. If a bit is set and unset in the same frame, it is lost. */
function adapt(bits: InputBit, bit: InputBit, active: boolean): InputBit {
  return active ? bits | bit : bits & ~bit
}
