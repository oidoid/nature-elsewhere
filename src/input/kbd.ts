export interface ControllerState {
  left: boolean
  right: boolean
  up: boolean
  down: boolean
  zap: boolean
  menu: boolean
}

export interface ControllerMap {
  [key: string]: keyof ControllerState
}

// Lowercase Event.key to ControllerState action.
export const defaultControllerMap: ControllerMap = {
  arrowleft: 'left',
  arrowright: 'right',
  arrowup: 'up',
  arrowdown: 'down',
  ' ': 'zap',
  escape: 'menu'
}
