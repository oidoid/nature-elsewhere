import * as atlas from './atlas.js'

/**
 * @typedef {Object} State
 * @prop {number} period Cel index oscillation state. This integer may fall out
 *                       of animation bounds.
 * @prop {number} duration Cel exposure in milliseconds.
 */

/**
 * @type {Readonly<
 *   Record<atlas.AnimationDirection, (period: number, length: number) => number>
 * >}
 */
const NextCel = {
  /** @arg {number} period An integer in the domain [0, +∞). */
  [atlas.AnimationDirection.FORWARD](period) {
    return (period % Number.MAX_SAFE_INTEGER) + 1
  },
  /** @arg {number} period An integer in the domain (-∞, 0]. */
  [atlas.AnimationDirection.REVERSE](period, length) {
    return (period % Number.MIN_SAFE_INTEGER) - 1 + length
  },
  /**
   * @arg {number} period An integer in the domain
   *                      [-animation.length + 2, animation.length - 1].
   */
  [atlas.AnimationDirection.PING_PONG](period, length) {
    return ((period - 1 - (length - 1)) % (2 * (length - 1))) + (length - 1)
  }
}

/**
 * @arg {number} [period]
 * @arg {number} [duration]
 * @return {State}
 */
export function newState(period = 0, duration = 0) {
  return {period, duration}
}

/**
 * @arg {Readonly<{period: number}>} state
 * @arg {atlas.Animation} animation
 * @return {atlas.Cel}
 */
export function cel(state, animation) {
  return animation.cels[celIndex(state, animation)]
}

/**
 * @arg {Readonly<{period: number}>} state
 * @arg {atlas.Animation} animation
 * @return {number}
 */
export function celIndex({period}, animation) {
  return Math.abs(period % animation.cels.length)
}

/**
 * @arg {State} state
 * @arg {number} step
 * @arg {atlas.Animation} animation
 * @return {void}
 */
export function step(state, step, animation) {
  if (animation.cels.length < 2) return

  const duration = state.duration + step
  if (duration < cel(state, animation).duration) {
    // Hold cel.
    state.duration = duration
  } else {
    // Advance cel.
    state.duration = duration - cel(state, animation).duration
    state.period = NextCel[animation.direction](
      state.period,
      animation.cels.length
    )
  }
}
