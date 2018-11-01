import * as atlas from './atlas.js'

/**
 * @typedef {Object} State
 * @prop {atlas.Animation} animation
 * @prop {number} period Cel index oscillation state. This value may fall out of
 *                       animation bounds.
 * @prop {number} exposure Cel exposure in milliseconds.
 */

/**
 * @type {Readonly<
 *   Record<atlas.AnimationDirection, (period: number, length: number) => number>
 * >}
 */
const NextCel = {
  [atlas.AnimationDirection.FORWARD](period) {
    return period + 1
  },
  [atlas.AnimationDirection.REVERSE](period, length) {
    return period - 1 + length
  },
  [atlas.AnimationDirection.PING_PONG](period, length) {
    return ((period - 1 - (length - 1)) % (2 * (length - 1))) + (length - 1)
  }
}

/**
 * @arg {atlas.Animation} animation
 * @arg {number} [period]
 * @arg {number} [exposure]
 * @return {State}
 */
export function newState(animation, period = 0, exposure = 0) {
  return {animation, period, exposure}
}

/**
 * @arg {Readonly<{animation: atlas.Animation, period: number}>} state
 * @return {atlas.Cel}
 */
export function cel(state) {
  return state.animation.cels[celIndex(state)]
}

/**
 * @arg {Readonly<{animation: atlas.Animation, period: number}>} state
 * @return {number}
 */
export function celIndex({animation, period}) {
  return Math.abs(period % animation.cels.length)
}

/**
 * @arg {State} state
 * @arg {number} step
 * @return {void}
 */
export function step(state, step) {
  if (state.animation.cels.length < 2) return

  const exposure = state.exposure + step
  const duration = cel(state).duration
  if (exposure < duration) {
    // Hold cel.
    state.exposure = exposure
  } else {
    // Advance cel.
    state.exposure = exposure - duration
    state.period = NextCel[state.animation.direction](
      state.period,
      state.animation.cels.length
    )
  }
}
