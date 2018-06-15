import {Action} from './action'

export interface KeyMap {
  // Event.key
  [key: string]: Action
}

export const DEFAULT_KEY_MAP: KeyMap = {
  ArrowLeft: Action.LEFT,
  ArrowRight: Action.RIGHT,
  ArrowUp: Action.UP,
  ArrowDown: Action.DOWN,
  Shift: Action.RUN,
  ' ': Action.ZAP,
  Escape: Action.MENU
}
