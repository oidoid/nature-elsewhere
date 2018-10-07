import * as recorder from './recorder'

/** An KeyboardEvent.key. */
export type Key = string
export type KeyMap = Readonly<Record<Key, recorder.Mask>>

export const defaultKeyMap: KeyMap = {
  ArrowLeft: recorder.Mask.LEFT,
  ArrowRight: recorder.Mask.RIGHT,
  ArrowUp: recorder.Mask.UP,
  ArrowDown: recorder.Mask.DOWN,
  Escape: recorder.Mask.MENU,
  p: recorder.Mask.DEBUG_CONTEXT_LOSS
}
