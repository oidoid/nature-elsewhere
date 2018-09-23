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

export type State = Readonly<
  Record<Input, {active: boolean; triggered: boolean}>
>

export function newState(): State {
  const ret = inputValues().reduce(
    (sum, input) => ({...sum, [input]: {active: false, triggered: false}}),
    <State>{}
  )
  return ret
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
  return inputValues().reduce(
    (sum, input) => ({...sum, [input]: {...state[input], triggered: false}}),
    <State>{}
  )
}

// Enums provide two mappings. This state machine only supports values.
function inputValues(): Input[] {
  return util.values(Input).filter(input => typeof input === 'number')
}
