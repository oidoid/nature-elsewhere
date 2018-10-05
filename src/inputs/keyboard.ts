import * as recorder from './recorder'

/** An KeyboardEvent.key. */
export type Key = string
export type KeyMap = Readonly<Record<Key, recorder.Input>>

export const DEFAULT_KEY_MAP: KeyMap = {
  ArrowLeft: recorder.Input.LEFT,
  ArrowRight: recorder.Input.RIGHT,
  ArrowUp: recorder.Input.UP,
  ArrowDown: recorder.Input.DOWN,
  Shift: recorder.Input.RUN,
  Control: recorder.Input.ZAP,
  Escape: recorder.Input.MENU,
  p: recorder.Input.DEBUG_CONTEXT_LOSS
}
