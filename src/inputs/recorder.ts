import * as util from '../util'

export enum Input {
  LEFT,
  RIGHT,
  UP,
  DOWN,
  JUMP,
  RUN,
  ZAP,
  MENU,
  DEBUG_CONTEXT_LOSS
}

export type State = Readonly<
  Record<Input, Readonly<{active: boolean; triggered: boolean}>>
>

export function newState(): State {
  return util.numericalValues(Input).reduce(
    (sum, input) => ({
      ...sum,
      [input]: {active: false, triggered: false}
    }),
    <State>{}
  )
}

/** Set or clear an Input state record. */
export function nextActiveState(
  state: State,
  input: Input,
  active: boolean
): State {
  return {
    ...state,
    [input]: {active, triggered: active && !state[input].active}
  }
}

/** Clear all triggered Inputs. */
export function nextTriggeredState(state: State): State {
  return util
    .numericalValues(Input)
    .reduce(
      (sum, input) => ({...sum, [input]: {...state[input], triggered: false}}),
      <State>{}
    )
}
