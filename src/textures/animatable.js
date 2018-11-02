import * as animator from './animator.js'
import * as atlas from './atlas.js'

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
 * @arg {atlas.Animation} animation
 * @return {void}
 */
export function step(state, step, animation) {
  state.scrollPosition.x += step * state.scrollSpeed.x
  state.scrollPosition.y += step * state.scrollSpeed.y
  animator.step(state.animator, step, animation)
}

/**
 * @arg {{readonly animator: animator.State}} state
 * @arg {atlas.Animation} animation
 * @return {Rect}
 */
export function bounds(state, animation) {
  return animator.cel(state.animator, animation).bounds
}
