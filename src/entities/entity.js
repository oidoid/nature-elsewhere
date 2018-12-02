import * as animatable from '../drawables/animatable.js'
import * as drawable from '../drawables/drawable.js'

/** @typedef {import('../drawables/atlas').Atlas} Atlas} */
/** @typedef {import('./entity-id').EntityID} EntityID} */

/**
 * A group of Animatables with a behavior and relative position and speed.
 * @typedef {Readonly<{
 *   id: EntityID
 *   animatables: (drawable.State|animatable.State)[]
 *   position: Mutable<XY>
 *   speed: Mutable<XY>
 * }>} State
 */

/**
 * @arg {EntityID} id
 * @arg {ReadonlyArray<drawable.State|animatable.State>} animatables
 * @arg {XY} [position]
 * @arg {XY} [speed]
 * @return {State}
 */
export function newState(
  id,
  animatables,
  position = {x: 0, y: 0},
  speed = {x: 0, y: 0}
) {
  return {id, animatables: [...animatables], position, speed}
}

/**
 * @arg {State} state
 * @arg {number} milliseconds
 * @arg {Atlas} atlas
 * @return {void}
 */
export function step(state, milliseconds, atlas) {
  state.position.x += milliseconds * state.speed.x
  state.position.y += milliseconds * state.speed.y
  state.animatables.forEach(val => {
    if ('animator' in val) {
      animatable.step(val, milliseconds, atlas.animations[val.animationID])
    }
  })
}

/**
 * @arg {State} state
 * @arg {number} index
 * @arg {Atlas} atlas
 * @return {Rect}
 */
export function coord(state, index, atlas) {
  const animatable = state.animatables[index]
  const animation = atlas.animations[animatable.animationID]
  return {...animation.cels[animatable.cel].position, ...animation.size}
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
    x: Math.trunc(state.position.x) + state.animatables[index].position.x,
    y: Math.trunc(state.position.y) + state.animatables[index].position.y
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

/**
 * @arg {State} state
 * @arg {number} index
 * @return {number}
 */
export function palette(state, index) {
  return state.animatables[index].palette
}

/**
 * @arg {State} state
 * @arg {number} index
 * @arg {Atlas} atlas
 * @return {WH}
 */
export function wh(state, index, atlas) {
  const wh = state.animatables[index].wh
  if (wh) return wh
  const animatable = state.animatables[index]
  const animation = atlas.animations[animatable.animationID]
  return animation.size
}
