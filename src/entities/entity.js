import * as animatable from '../textures/animatable.js'
import * as recorder from '../inputs/recorder.js'
import {Layer} from '../textures/layer.js'

/** @typedef {import('../textures/atlas').Atlas} Atlas} */

/**
 * @typedef {Readonly<{
 *   animatables: animatable.State[]
 *   position: Mutable<XY>
 *   speed: Mutable<XY>
 *   step(step: number, atlas: Atlas, recorderState: recorder.ReadState): void
 *   layer(): Layer
 * }>} State
 */

/**
 * @arg {animatable.State[]} animatables
 * @arg {Layer} layer
 * @arg {XY} [position]
 * @arg {XY} [speed]
 * @return {State}
 */
export function newState(
  animatables,
  layer,
  position = {x: 0, y: 0},
  speed = {x: 0, y: 0}
) {
  return {
    animatables,
    position,
    speed,
    step(stepState, atlas) {
      step(this, stepState, atlas)
    },
    layer() {
      return layer
    }
  }
}

/**
 * @arg {State} state
 * @arg {number} step
 * @arg {Atlas} atlas
 * @return {void}
 */
export function step(state, step, atlas) {
  state.animatables.forEach(val => {
    animatable.step(val, step, atlas.animations[val.animationID])
    val.position.x += step * state.speed.x
    val.position.y += step * state.speed.y
  })
}

/**
 * @arg {State} state
 * @arg {number} index
 * @return {Rect}
 */
export function coord(state, index) {
  return animatable.bounds(state.animatables[index])
}

/**
 * @arg {State} state
 * @arg {number} index
 * @return {XY}
 */
export function scrollPosition(state, index) {
  return state.animatables[index].scrollPosition
}

/**
 * @arg {State} state
 * @arg {number} index
 * @return {XY}
 */
export function position(state, index) {
  return {
    x: state.position.x + state.animatables[index].position.x,
    y: state.position.y + state.animatables[index].position.y
  }
}

/**
 * @arg {State} state
 * @arg {number} index
 * @return {XY}
 */
export function scale(state, index) {
  return state.animatables[index].scale
}
