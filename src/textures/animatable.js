import * as animator from './animator.js'
import * as atlas from './atlas.js'

/** @typedef {import('./drawable').State} Drawable */

/**
 * @typedef {Drawable & {
 *   readonly scrollSpeed: XY
 *   animator?: animator.State
 * }} State
 */

/**
 * @arg {Drawable} drawable
 * @arg {XY} scrollSpeed
 * @return {State}
 */
export function newState(drawable, scrollSpeed = {x: 0, y: 0}) {
  return {...drawable, scrollSpeed}
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
  if (!state.animator || state.animator.animation !== animation) {
    state.animator = animator.newState(animation)
  }
  animator.step(state.animator, step)
}

/**
 * @arg {{readonly animator?: animator.State}} state
 * @return {Rect}
 */
export function bounds(state) {
  return state.animator
    ? animator.cel(state.animator).bounds
    : {x: 0, y: 0, w: 0, h: 0}
}
