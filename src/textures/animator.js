import * as atlas from './atlas.js'

/**
 * @typedef {Object} State
 * @prop {atlas.Animation} animation
 * @prop {number} period Cel index oscillation state. This value may fall out of
 *                       animation bounds.
 * @prop {number} duration Cel exposure in milliseconds.
 */

/**
 * @type {Readonly<
 *   Record<atlas.AnimationDirection, (period: number, length: number) => number>
 * >}
 */
const NextCel = {
  [atlas.AnimationDirection.FORWARD](period) {
    return (period % Number.MAX_SAFE_INTEGER) + 1
  },
  [atlas.AnimationDirection.REVERSE](period, length) {
    return (period % Number.MIN_SAFE_INTEGER) - 1 + length
  },
  [atlas.AnimationDirection.PING_PONG](period, length) {
    // The valid domain of period is [-(length - 2), length - 1].
    return ((period - 1 - (length - 1)) % (2 * (length - 1))) + (length - 1)
  }
}

/**
 * @arg {atlas.Animation} animation
 * @arg {number} [period]
 * @arg {number} [duration]
 * @return {State}
 */
export function newState(animation, period = 0, duration = 0) {
  return {animation, period, duration}
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

  const duration = state.duration + step
  if (duration < cel(state).duration) {
    // Hold cel.
    state.duration = duration
  } else {
    // Advance cel.
    state.duration = duration - cel(state).duration
    state.period = NextCel[state.animation.direction](
      state.period,
      state.animation.cels.length
    )
  }
}
