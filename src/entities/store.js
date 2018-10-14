import * as atlas from './atlas.js'
import * as entity from './entity.js'
import * as recorder from '../inputs/recorder.js'
import * as shader from '../graphics/shader.js'

/** @typedef {{memory: Int16Array; readonly entities: entity.State[]}} State */

/** @return {State} */
export function newState() {
  return {memory: new Int16Array(), entities: []}
}

/**
 * @arg {State} state
 * @arg {ReadonlyArray<entity.State>} entities
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
 * @arg {State} state
 * @arg {number} step
 * @arg {atlas.State} atlas
 * @arg {recorder.ReadState} recorderState
 * @return {void}
 */
export function nextStepState(state, step, atlas, recorderState) {
  state.entities.forEach(val =>
    entity.nextStepState(val, step, atlas, recorderState)
  )
}

/**
 * @arg {State} state
 * @arg {atlas.State} atlasState
 * @return {void}
 */
export function flushUpdatesToMemory(state, atlasState) {
  const length = state.entities.length
  if (state.memory.length < length * shader.layout.perInstance.length) {
    state.memory = new Int16Array(length * shader.layout.perInstance.length * 2)
  }
  state.entities.forEach(
    ({scrollPosition, position, scale, animationID, cel}, i) => {
      const cels = atlasState.animations[animationID].cels
      const coord =
        cels[entity.cel({cel}, atlasState.animations[animationID])].bounds
      // prettier-ignore
      state.memory.set([coord.x, coord.y, coord.w, coord.h,
                        scrollPosition.x, scrollPosition.y,
                        position.x, position.y,
                        scale.x, scale.y],
                       i * shader.layout.perInstance.length)
    }
  )
}
