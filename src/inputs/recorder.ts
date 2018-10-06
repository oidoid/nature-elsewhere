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

export type InputState = Readonly<{
  active: boolean
  positive: boolean
  doublePositive: boolean
  duration: number
}>
export type State = Readonly<Record<Input, InputState>>

export function newState(): State {
  return util.numericalValues(Input).reduce(
    (sum, input) => {
      const state: InputState = {
        active: false,
        positive: false,
        doublePositive: false,
        duration: Number.POSITIVE_INFINITY
      }
      return {...sum, [input]: state}
    },
    <State>{}
  )
}

export function nextActiveState(
  state: State,
  input: Input,
  active: boolean
): State {
  const positive = active && !state[input].active
  const inputState: InputState = {
    active,
    positive,
    doublePositive: positive && state[input].duration < 1000,
    duration: positive ? 0 : state[input].duration
  }
  return {...state, [input]: inputState}
}

/** Clear all triggered Inputs. */
export function nextLoopState(state: State, step: number): State {
  return util.numericalValues(Input).reduce(
    (sum, input) => {
      const inputState: InputState = {
        ...state[input],
        positive: false,
        duration: state[input].duration + step * 1000
      }
      return {...sum, [input]: inputState}
    },
    <State>{}
  )
}
