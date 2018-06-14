export enum Action {
  LEFT,
  RIGHT,
  UP,
  DOWN,
  ZAP,
  MENU
}

export type Active = boolean
export type ActionState = {[action in Action]: Active}
