import {values} from '../util'

export enum Action {
  LEFT,
  RIGHT,
  UP,
  DOWN,
  RUN,
  ZAP,
  MENU,
  DEBUG_CONTEXT_LOSS
}

export type Active = boolean
export type ActionState = Record<Action, Active>

export function newActionState(): ActionState {
  return values(Action).reduce((sum, action) => ({...sum, [action]: false}), <
    ActionState
  >{})
}
