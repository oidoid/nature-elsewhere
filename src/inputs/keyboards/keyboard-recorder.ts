import * as defaultKeyboardMap from '../../assets/inputs/default-keyboard-map.json'
import {InputBit} from '../input-bit'

type Key = KeyboardEvent['key']
type KeyMap = Readonly<Partial<Record<Key, InputBit.Key>>>

export namespace KeyboardRecorder {
  /** Call this const when a keydown or keyup KeyboardEvent is received. */
  export const onKey = (bits: InputBit, ev: KeyboardEvent): InputBit => {
    const bit = (<KeyMap>defaultKeyboardMap)[eventToKey(ev)]
    if (bit === undefined) return bits
    ev.preventDefault()
    return adapt(bits, InputBit[bit], ev.type === 'keydown')
  }
}

const eventToKey = (ev: KeyboardEvent): string => {
  const meta = ev.metaKey ? 'Meta+' : ''
  const ctrl = ev.ctrlKey ? 'Control+' : ''
  const alt = ev.altKey ? 'Alt+' : ''
  const shift = ev.shiftKey ? 'Shift+' : ''
  return meta + ctrl + alt + shift + ev.key
}

/** Converts an Event-based active / inactive input, keydown / keyup, to a
    polled input. Without this adapter, the Recorder must track which inputs to
    persist (roll over to prime the next sample) every update loop which
    complicates its logic. When all inputs are polled like Gamepad, the Recorder
    can safely start with a zeroed sample each loop since any carryover status
    will be provided by the underlying adapters. Bits persist until cleared by
    reset or keyup. If a bit is set and unset in the same frame, it is lost. */
const adapt = (bits: InputBit, bit: InputBit, active: boolean): InputBit =>
  active ? bits | bit : bits & ~bit
