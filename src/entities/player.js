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

  state._animationID = animationID(state, recorderState)
  const run =
    recorderState.combo(false, recorder.Mask.LEFT, recorder.Mask.LEFT) ||
    recorderState.combo(false, recorder.Mask.RIGHT, recorder.Mask.RIGHT)
  state._cel =
    Math.abs(Math.round(state._position.x / (run ? 6 : 2))) %
    atlas.animations[state._animationID].cels.length
}

/**
 * @arg {entity.State} state
 * @return {boolean}
 */
function grounded(state) {
  return state._position.y >= -17
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
    (state._animationID === animation.ID.PLAYER_CROUCH ||
      state._animationID === animation.ID.PLAYER_SIT)
  ) {
    return animation.ID.PLAYER_SIT
  }

  if (recorderState.down()) {
    if (
      state._animationID === animation.ID.PLAYER_CROUCH ||
      state._animationID === animation.ID.PLAYER_SIT
    ) {
      return state._animationID
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
    if (state._animationID === animation.ID.PLAYER_SIT) {
      return animation.ID.PLAYER_CROUCH
    }
    return animation.ID.PLAYER_IDLE
  }

  if (
    state._animationID === animation.ID.PLAYER_CROUCH ||
    state._animationID === animation.ID.PLAYER_SIT
  ) {
    return state._animationID
  }

  return animation.ID.PLAYER_IDLE
}

/**
 * @arg {entity.State} state
 * @arg {recorder.ReadState} recorderState
 * @return {void}
 */
function scale(state, recorderState) {
  state._scale.x = recorderState.left()
    ? -1
    : recorderState.right()
      ? 1
      : state._scale.x
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
  state._position.x = Math.max(
    0,
    state._position.x -
      (recorderState.left() ? speed : 0) +
      (recorderState.right() ? speed : 0)
  )
  state._position.y = Math.min(
    -17,
    state._position.y -
      (recorderState.up() ? speed : 0) +
      (recorderState.down() ? speed : 0)
  )
}
