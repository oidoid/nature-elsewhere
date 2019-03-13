import {InputBit} from './input-bit'
import {ObjectUtil} from '../utils/object-util'
import {Recorder} from './recorder'

export namespace Keyboard {
  export type Key = KeyboardEvent['key']
  export type KeyMap = Readonly<Record<Key, InputBit>>

  export const defaultKeyMap: KeyMap = ObjectUtil.freeze({
    ArrowLeft: InputBit.LEFT,
    a: InputBit.LEFT,
    ArrowRight: InputBit.RIGHT,
    d: InputBit.RIGHT,
    ArrowUp: InputBit.UP,
    w: InputBit.UP,
    ArrowDown: InputBit.DOWN,
    s: InputBit.DOWN,
    ' ': InputBit.ACTION,
    Enter: InputBit.ACTION,
    Escape: InputBit.MENU,
    p: InputBit.DEBUG_CONTEXT_LOSS,
    0: InputBit.SCALE_RESET,
    '-': InputBit.SCALE_DECREASE,
    '+': InputBit.SCALE_INCREASE,
    1: InputBit.PREV_ENTITY,
    2: InputBit.NEXT_ENTITY
  })

  export function onKey(recorder: Recorder, event: KeyboardEvent): void {
    const key = defaultKeyMap[event.key]
    if (key === undefined) return

    const active = event.type === 'keydown'
    recorder.set(key, active)

    event.preventDefault()
  }
}
