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
export type ActionState = Record<Action, Active>

export function newActionState(): ActionState {
  return Object.values(Action).reduce(
    (sum: ActionState, action: Action) => ({...sum, [action]: false}),
    {}
  )
}
