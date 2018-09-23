// https://gist.github.com/blixt/f17b47c62508be59987b
// http://www.firstpr.com.au/dsp/rand31/

export type NewState = {readonly seed: number}
export type NextState = Readonly<{result: number} & NewState>
export type State = NewState | NextState

/** @param seed An integer. */
export function newState(seed: number): NewState {
  let next = seed % 2147483647
  if (next <= 0) next += 2147483646
  return {seed: next}
}

/** @return [min, max) */
export function nextFloatState(
  state: State,
  min: number = 0,
  max: number = 1
): NextState {
  const seed = (state.seed * 16807) % 2147483647
  return {seed, result: min + ((max - min) * (seed - 1)) / 2147483646}
}

/** @return An integer [min, max). */
export function nextIntState(
  state: State,
  min: number,
  max: number
): NextState {
  const next = nextFloatState(state, min, max)
  return {...next, result: Math.floor(next.result)}
}
