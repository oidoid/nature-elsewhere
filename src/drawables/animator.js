import * as atlas from './atlas.js'
import * as util from '../util.js'

/**
 * @typedef {Object} State
 * @prop {number} period Cel index oscillation state. This integer may fall out
 *                       of animation bounds.
 * @prop {number} duration Cel exposure in milliseconds.
 */

/**
 * @type {Readonly<
 *   Record<
 *     atlas.AnimationDirection,
 *     (period: number, length: number) => number
 *   >
 * >}
 */
const Animate = {
  /** @arg {number} period An integer in the domain [0, +∞). */
  [atlas.AnimationDirection.FORWARD](period) {
    return (period % Number.MAX_SAFE_INTEGER) + 1
  },
  /** @arg {number} period An integer in the domain (-∞, length - 1]. */
  [atlas.AnimationDirection.REVERSE](period, length) {
    return (period % Number.MIN_SAFE_INTEGER) - 1 + length
  },
  /** @arg {number} period An integer in the domain [2 - length, length - 1]. */
  [atlas.AnimationDirection.PING_PONG](period, length) {
    return util.wrap(period - 1, 2 - length, length)
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
 * @return {number}
 */
export function celIndex({period}, animation) {
  return Math.abs(period % animation.cels.length)
}

/**
 * @arg {State} state
 * @arg {number} milliseconds
 * @arg {atlas.Animation} animation
 * @return {void}
 */
export function step(state, milliseconds, animation) {
  if (animation.cels.length < 2) return

  state.duration += milliseconds
  const duration = animation.cels[celIndex(state, animation)].duration
  if (state.duration >= duration) {
    // Advance cel. It's possible that more than one cel should be advanced.
    // However, it's necessary to assume not so that in the event that the step
    // delta is great and the frequency low, the cel isn't advanced every frame
    // which would create a fast-forward effect.
    state.duration = 0
    state.period = Animate[animation.direction](
      state.period,
      animation.cels.length
    )
  }
}
