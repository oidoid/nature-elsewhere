import * as animatable from '../drawables/animatable.js'

/** @typedef {import('../drawables/atlas').Atlas} Atlas} */
/** @typedef {import('./entity-id').EntityID} EntityID} */

/**
 * @typedef {Readonly<{
 *   id: EntityID
 *   animatables: animatable.State[]
 *   position: Mutable<XY>
 *   speed: Mutable<XY>
 * }>} State
 */

/**
 * @arg {EntityID} id
 * @arg {animatable.State[]} animatables
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
  return {id, animatables, position, speed}
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
 * @arg {Atlas} atlas
 * @return {Rect}
 */
export function coord(state, index, atlas) {
  return animatable.bounds(
    state.animatables[index],
    atlas.animations[state.animatables[index].animationID]
  )
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
