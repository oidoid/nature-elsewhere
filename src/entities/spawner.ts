import * as atlas from '../assets/atlas'
import * as entity from './entity'
import * as recorder from '../inputs/recorder'
import * as shaderLayout from '../graphics/shader.json'

export type State = {memory: Int16Array; readonly entities: entity.State[]}

export function newState(): State {
  return {memory: new Int16Array(), entities: []}
}

export function nextSpawnState(state: State, entities: entity.State[]): void {
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

export function nextStepState(
  state: State,
  step: number,
  atlas: atlas.State,
  recorderState: recorder.State
): void {
  state.entities.forEach(val =>
    entity.nextStepState(val, step, atlas, recorderState)
  )
}

export function flushUpdatesToMemory(
  atlasState: atlas.State,
  state: State
): void {
  const length = state.entities.length
  if (state.memory.length < length * shaderLayout.perInstance.length) {
    state.memory = new Int16Array(length * shaderLayout.perInstance.length * 2)
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
                     i * shaderLayout.perInstance.length)
    }
  )
}
