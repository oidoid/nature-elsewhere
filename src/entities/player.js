import * as animation from './animation.js'
import * as atlas from './atlas.js'
import * as entity from './entity.js'
import * as recorder from '../inputs/recorder.js'

/**
 * @arg {entity.State} state
 * @arg {number} step
 * @arg {atlas.State} atlas
 * @arg {recorder.ReadState} recorderState
 * @return {void}
 */
export function nextStepState(state, step, atlas, recorderState) {
  scale(state, recorderState)
  position(state, recorderState, step)

  state.animationID = animationID(state, recorderState)
  const run =
    recorderState.combo(false, recorder.Mask.LEFT, recorder.Mask.LEFT) ||
    recorderState.combo(false, recorder.Mask.RIGHT, recorder.Mask.RIGHT)
  state.cel =
    Math.abs(Math.round(state.position.x / (run ? 6 : 2))) %
    atlas.animations[state.animationID].cels.length
}

/**
 * @arg {entity.State} state
 * @return {boolean}
 */
function grounded(state) {
  return state.position.y >= -17
}

/**
 * @arg {entity.State} state
 * @arg {recorder.ReadState} recorderState
 * @return {animation.ID}
 */
function animationID(state, recorderState) {
  if (!grounded(state)) {
    if (recorderState.up()) {
      return animation.ID.PLAYER_ASCEND
    }

    return animation.ID.PLAYER_DESCEND
  }

  if (
    recorderState.down(true) &&
    (state.animationID === animation.ID.PLAYER_CROUCH ||
      state.animationID === animation.ID.PLAYER_SIT)
  ) {
    return animation.ID.PLAYER_SIT
  }

  if (recorderState.down()) {
    if (
      state.animationID === animation.ID.PLAYER_CROUCH ||
      state.animationID === animation.ID.PLAYER_SIT
    ) {
      return state.animationID
    }
    return animation.ID.PLAYER_CROUCH
  }

  if (recorderState.left() || recorderState.right()) {
    const run =
      recorderState.combo(false, recorder.Mask.LEFT, recorder.Mask.LEFT) ||
      recorderState.combo(false, recorder.Mask.RIGHT, recorder.Mask.RIGHT)

    if (run) return animation.ID.PLAYER_RUN
    return animation.ID.PLAYER_WALK
  }

  if (recorderState.up()) {
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

/**
 * @arg {entity.State} state
 * @arg {recorder.ReadState} recorderState
 * @return {void}
 */
function scale(state, recorderState) {
  state.scale.x = recorderState.left()
    ? -1
    : recorderState.right()
      ? 1
      : state.scale.x
}

/**
 * @arg {entity.State} state
 * @arg {recorder.ReadState} recorderState
 * @arg {number} step
 * @return {void}
 */
function position(state, recorderState, step) {
  if (grounded(state) && recorderState.down()) return
  const run =
    recorderState.combo(false, recorder.Mask.LEFT, recorder.Mask.LEFT) ||
    recorderState.combo(false, recorder.Mask.RIGHT, recorder.Mask.RIGHT)
  const speed = (run ? 0.048 : 0.016) * step
  state.position.x = Math.max(
    0,
    state.position.x -
      (recorderState.left() ? speed : 0) +
      (recorderState.right() ? speed : 0)
  )
  state.position.y = Math.min(
    -17,
    state.position.y -
      (recorderState.up() ? speed : 0) +
      (recorderState.down() ? speed : 0)
  )
}
