import * as atlas from '../assets/atlas'
import * as entity from './entity'
import * as recorder from '../inputs/recorder'
import * as texture from '../assets/texture'

export function nextStepState(
  state: entity.State,
  step: number,
  atlas: atlas.State,
  recorderState: recorder.State
): void {
  scale(state, recorderState)
  position(state, recorderState, step)

  state.textureID = textureID(state, recorderState)
  const cel =
    Math.abs(
      Math.round(
        state.position.x / (recorderState[recorder.Input.RUN].active ? 6 : 2)
      )
    ) % atlas.animations[state.textureID].cels.length
  const coord = atlas.animations[state.textureID].cels[cel].bounds
  state.coord.x = coord.x
  state.coord.y = coord.y
  state.coord.w = coord.w
  state.coord.h = coord.h
}

function grounded(state: entity.State): boolean {
  return state.position.y >= -17
}

function textureID(
  state: entity.State,
  recorderState: recorder.State
): texture.ID {
  if (recorderState[recorder.Input.DOWN].active) {
    if (!grounded(state)) return texture.ID.PLAYER_DESCEND
    if (
      state.textureID === texture.ID.PLAYER_CROUCH ||
      state.textureID === texture.ID.PLAYER_SIT
    ) {
      return texture.ID.PLAYER_SIT
    }

    return texture.ID.PLAYER_CROUCH
  }
  if (recorderState[recorder.Input.UP].active || !grounded(state)) {
    return texture.ID.PLAYER_ASCEND
  }

  if (
    recorderState[recorder.Input.LEFT].active ||
    recorderState[recorder.Input.RIGHT].active
  ) {
    if (recorderState[recorder.Input.RUN].active) return texture.ID.PLAYER_RUN
    return texture.ID.PLAYER_WALK
  }

  return texture.ID.PLAYER_IDLE
}

function scale(state: entity.State, recorderState: recorder.State): void {
  state.scale.x = recorderState[recorder.Input.LEFT].active
    ? -1
    : recorderState[recorder.Input.RIGHT].active
      ? 1
      : state.scale.x
}

function position(
  state: entity.State,
  recorderState: recorder.State,
  step: number
): void {
  if (grounded(state) && recorderState[recorder.Input.DOWN].active) return
  // todo: add pixel per second doc.
  const pps = (recorderState[recorder.Input.RUN].active ? 48 : 16) * step
  state.position.x = Math.max(
    0,
    state.position.x -
      (recorderState[recorder.Input.LEFT].active ? pps : 0) +
      (recorderState[recorder.Input.RIGHT].active ? pps : 0)
  )
  state.position.y = Math.min(
    -17,
    state.position.y -
      (recorderState[recorder.Input.UP].active ? pps : 0) +
      (recorderState[recorder.Input.DOWN].active ? pps : 0)
  )
}
