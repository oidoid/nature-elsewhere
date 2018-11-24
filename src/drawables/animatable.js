import * as animator from './animator.js'

/** @typedef {import('./atlas').Animation} Animation */
/** @typedef {import('./drawable').State} Drawable */

/**
 * @typedef {Drawable & Readonly<{
 *   scrollSpeed: XY
 *   animator: animator.State
 * }>} State
 */

/**
 * A Drawable with cel animation and scrolling.
 * @arg {Drawable} drawable
 * @arg {XY} scrollSpeed
 * @arg {animator.State} animatorState
 * @return {State}
 */
export function newState(
  drawable,
  scrollSpeed = {x: 0, y: 0},
  animatorState = animator.newState()
) {
  return {...drawable, animator: animatorState, scrollSpeed}
}

/**
 * @arg {State} state
 * @arg {number} milliseconds
 * @arg {Animation} animation
 * @return {void}
 */
export function step(state, milliseconds, animation) {
  state.scrollPosition.x += milliseconds * state.scrollSpeed.x
  state.scrollPosition.y += milliseconds * state.scrollSpeed.y
  animator.step(state.animator, milliseconds, animation)
  state.cel = animator.celIndex(state.animator, animation)
}
