export enum Action {
  LEFT,
  RIGHT,
  UP,
  DOWN,
  RUN,
  ZAP,
  MENU
}

export type Active = boolean
export type ActionState = {[action in Action]: Active}

export function newActionState(): ActionState {
  return Object.assign(
    {},
    ...Object.values(Action).map(action => ({[action]: false}))
  )
}
