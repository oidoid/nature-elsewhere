import * as animation from './animation'
import * as atlas from './atlas'
import * as entity from './entity'
import * as recorder from '../inputs/recorder'

export function nextStepState(
  state: entity.State,
  step: number,
  atlas: atlas.State,
  recorderState: recorder.State
): void {
  scale(state, recorderState)
  position(state, recorderState, step)

  state.animationID = animationID(state, recorderState)
  state.cel =
    Math.abs(
      Math.round(
        state.position.x / (recorderState[recorder.Input.RUN].active ? 6 : 2)
      )
    ) % atlas.animations[state.animationID].cels.length
}

function grounded(state: entity.State): boolean {
  return state.position.y >= -17
}

function animationID(
  state: entity.State,
  recorderState: recorder.State
): animation.ID {
  if (!grounded(state)) {
    if (recorderState[recorder.Input.UP].active) {
      return animation.ID.PLAYER_ASCEND
    }

    return animation.ID.PLAYER_DESCEND
  }

  if (
    recorderState[recorder.Input.DOWN].positive &&
    (state.animationID === animation.ID.PLAYER_CROUCH ||
      state.animationID === animation.ID.PLAYER_SIT)
  ) {
    return animation.ID.PLAYER_SIT
  }

  if (recorderState[recorder.Input.DOWN].active) {
    if (
      state.animationID === animation.ID.PLAYER_CROUCH ||
      state.animationID === animation.ID.PLAYER_SIT
    ) {
      return state.animationID
    }
    return animation.ID.PLAYER_CROUCH
  }

  if (
    recorderState[recorder.Input.LEFT].active ||
    recorderState[recorder.Input.RIGHT].active
  ) {
    if (recorderState[recorder.Input.RUN].active) return animation.ID.PLAYER_RUN
    return animation.ID.PLAYER_WALK
  }

  if (recorderState[recorder.Input.UP].active) {
    if (state.animationID === animation.ID.PLAYER_SIT) {
      return animation.ID.PLAYER_CROUCH
    }
    return animation.ID.PLAYER_IDLE
  }

  if (
    state.animationID === animation.ID.PLAYER_CROUCH ||
    state.animationID === animation.ID.PLAYER_SIT
  ) {
    return state.animationID
  }

  return animation.ID.PLAYER_IDLE
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
