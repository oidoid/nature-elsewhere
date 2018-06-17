import {Action} from './action'

/** An KeyboardEvent.key. */
export type Key = string
export type KeyMap = {[key in Key]: Action}

export const DEFAULT_KEY_MAP: KeyMap = {
  ArrowLeft: Action.LEFT,
  ArrowRight: Action.RIGHT,
  ArrowUp: Action.UP,
  ArrowDown: Action.DOWN,
  Shift: Action.RUN,
  ' ': Action.ZAP,
  Escape: Action.MENU
}
