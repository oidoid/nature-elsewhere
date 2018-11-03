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
 * @arg {number} step
 * @arg {Animation} animation
 * @return {void}
 */
export function step(state, step, animation) {
  state.scrollPosition.x += step * state.scrollSpeed.x
  state.scrollPosition.y += step * state.scrollSpeed.y
  animator.step(state.animator, step, animation)
  state.cel = animator.celIndex(state.animator, animation)
}
