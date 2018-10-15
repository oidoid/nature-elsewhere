import * as atlas from '../textures/atlas.js'
import * as recorder from '../inputs/recorder.js'
import * as shader from '../graphics/shader.js'
import {Entity} from './entity.js'

/** @typedef {{memory: Int16Array; readonly entities: Entity[]}} Store */

/** @return {Store} */
export function newState() {
  return {memory: new Int16Array(), entities: []}
}

/**
 * @arg {Store} state
 * @arg {ReadonlyArray<Entity>} entities
 * @return {void}
 */
export function nextSpawnState(state, entities) {
  entities.forEach(entity => {
    let index = state.entities.findIndex(
      val => entity.drawOrder <= val.drawOrder
    )
    state.entities.splice(
      index === -1 ? state.entities.length : index,
      0,
      entity
    )
  })
}

/**
 * @arg {Store} state
 * @arg {number} step
 * @arg {atlas.Atlas} atlas
 * @arg {recorder.ReadState} recorderState
 * @return {void}
 */
export function nextStepState(state, step, atlas, recorderState) {
  state.entities.forEach(val => val.nextStepState(step, atlas, recorderState))
}

/**
 * @arg {Store} state
 * @return {void}
 */
export function flushUpdatesToMemory(state) {
  const length = state.entities.length
  if (state.memory.length < length * shader.layout.perInstance.length) {
    state.memory = new Int16Array(length * shader.layout.perInstance.length * 2)
  }
  state.entities.forEach((s, i) => {
    const coord = s.bounds
    // prettier-ignore
    state.memory.set([coord.x, coord.y, coord.w, coord.h,
                      s._scrollPosition.x, s._scrollPosition.y,
                      s._position.x, s._position.y,
                      s._scale.x, s._scale.y],
                      i * shader.layout.perInstance.length)
  })
}
