// https://gist.github.com/blixt/f17b47c62508be59987b
// http://www.firstpr.com.au/dsp/rand31/

/** @typedef {{seed: number}} State */

/**
 * @arg {number} seed
 * @return {State}
 */
export function newState(seed) {
  seed = seed % 2147483647
  if (seed <= 0) seed += 2147483646
  return {seed}
}

/**
 * @arg {State} state
 * @arg {number} [min]
 * @arg {number} [max]
 * @return {number} [min, max)
 */
export function float(state, min = 0, max = 1) {
  state.seed = (state.seed * 16807) % 2147483647
  return min + ((max - min) * (state.seed - 1)) / 2147483646
}

/**
 * @arg {State} state
 * @arg {number} [min]
 * @arg {number} [max]
 * @return {number} An integer [min, max).
 */
export function int(state, min, max) {
  return Math.floor(float(state, min, max))
}
