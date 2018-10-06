import * as util from '../util'

export enum Input {
  LEFT,
  RIGHT,
  UP,
  DOWN,
  RUN,
  ZAP,
  MENU,
  DEBUG_CONTEXT_LOSS
}

export type InputState = Readonly<{active: boolean; positive: boolean}>
export type State = Readonly<Record<Input, InputState>>

export function newState(): State {
  return util.numericalValues(Input).reduce(
    (sum, input) => {
      const state: InputState = {active: false, positive: false}
      return {...sum, [input]: state}
    },
    <State>{}
  )
}

/** Set or clear an Input state record. */
export function nextActiveState(
  state: State,
  input: Input,
  active: boolean
): State {
  const positive = active && !state[input].active
  const inputState: InputState = {active, positive}
  return {...state, [input]: inputState}
}

/** Clear all triggered Inputs. */
export function nextLoopState(state: State): State {
  return util.numericalValues(Input).reduce(
    (sum, input) => {
      const inputState: InputState = {...state[input], positive: false}
      return {...sum, [input]: inputState}
    },
    <State>{}
  )
}
