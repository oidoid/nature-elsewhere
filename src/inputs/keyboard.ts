import {InputMask} from './input-mask'
import {Recorder} from './recorder'

export type Key = KeyboardEvent['key']
export type KeyMap = Readonly<Record<Key, InputMask>>

export const defaultKeyMap: KeyMap = {
  ArrowLeft: InputMask.LEFT,
  a: InputMask.LEFT,
  ArrowRight: InputMask.RIGHT,
  d: InputMask.RIGHT,
  ArrowUp: InputMask.UP,
  w: InputMask.UP,
  ArrowDown: InputMask.DOWN,
  s: InputMask.DOWN,
  ' ': InputMask.ACTION,
  Escape: InputMask.MENU,
  p: InputMask.DEBUG_CONTEXT_LOSS,
  0: InputMask.SCALE_RESET,
  '-': InputMask.SCALE_DECREASE,
  '+': InputMask.SCALE_INCREASE,
  1: InputMask.PREV_ENTITY,
  2: InputMask.NEXT_ENTITY
}

export function onKeyChange(recorder: Recorder, event: KeyboardEvent): void {
  const key = defaultKeyMap[event.key]
  if (key === undefined) return

  const active = event.type === 'keydown'
  recorder.set(key, active)

  event.preventDefault()
}
