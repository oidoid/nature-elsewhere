import * as animatable from '../textures/animatable.js'
import * as atlas from '../textures/atlas.js'
import * as drawable from '../textures/drawable.js'
import * as entity from './entity.js'
import * as recorder from '../inputs/recorder.js'
import {AnimationID} from '../assets/animation-id.js'
import {Layer} from '../textures/layer.js'

/**
 * @arg {XY} position
 * @return {entity.State}
 */
export function newState(position = {x: 0, y: 0}) {
  return {
    animatables: [
      animatable.newState(
        drawable.newState(AnimationID.PLAYER_IDLE, {x: 0, y: 0})
      )
    ],
    position,
    speed: {x: 0, y: 0},
    step(stepState, atlas, recorder) {
      step(this, stepState, atlas, recorder)
    },
    layer: Layer.PLAYER
  }
}

/**
 * @arg {entity.State} state
 * @arg {number} step
 * @arg {atlas.Atlas} atlas
 * @arg {recorder.ReadState} recorder
 * @return {void}
 */
export function step(state, step, atlas, recorder) {
  __scale(state, recorder)
  __position(state, recorder, step)
  const animationID = __animationID(state, recorder)
  if (animationID !== state.animatables[0].animationID) {
    state.animatables[0] = animatable.newState(
      drawable.newState(
        animationID,
        state.animatables[0].position,
        state.animatables[0].scale
      )
    )
  }

  entity.step(state, step, atlas)
}

/**
 * @arg {{readonly position: XY}} state
 * @return {boolean}
 */
function _grounded({position}) {
  return position.y >= -17
}

/**
 * @arg {entity.State} state
 * @arg {recorder.ReadState} recorderState
 * @return {AnimationID}
 */
function __animationID(state, recorderState) {
  const animationID = state.animatables[0].animationID
  if (!_grounded(state)) {
    if (recorderState.up()) {
      return AnimationID.PLAYER_ASCEND
    }

    return AnimationID.PLAYER_DESCEND
  }

  if (
    recorderState.down(true) &&
    (animationID === AnimationID.PLAYER_CROUCH ||
      animationID === AnimationID.PLAYER_SIT)
  ) {
    return AnimationID.PLAYER_SIT
  }

  if (recorderState.down()) {
    if (
      animationID === AnimationID.PLAYER_CROUCH ||
      animationID === AnimationID.PLAYER_SIT
    ) {
      return animationID
    }
    return AnimationID.PLAYER_CROUCH
  }

  if (recorderState.left() || recorderState.right()) {
    const run =
      recorderState.combo(false, recorder.Mask.LEFT, recorder.Mask.LEFT) ||
      recorderState.combo(false, recorder.Mask.RIGHT, recorder.Mask.RIGHT)

    if (run) return AnimationID.PLAYER_RUN
    return AnimationID.PLAYER_WALK
  }

  if (recorderState.up()) {
    if (animationID === AnimationID.PLAYER_SIT) {
      return AnimationID.PLAYER_CROUCH
    }
    return AnimationID.PLAYER_IDLE
  }

  if (
    animationID === AnimationID.PLAYER_CROUCH ||
    animationID === AnimationID.PLAYER_SIT
  ) {
    return animationID
  }

  return AnimationID.PLAYER_IDLE
}

/**
 * @arg {{readonly animatables: ReadonlyArray<animatable.State>}} state
 * @arg {recorder.ReadState} recorderState
 * @return {void}
 */
function __scale({animatables}, recorderState) {
  animatables.forEach(animation => {
    animation.scale.x = recorderState.left()
      ? -1
      : recorderState.right()
        ? 1
        : animation.scale.x
  })
}

/**
 * @arg {entity.State} state
 * @arg {recorder.ReadState} recorderState
 * @arg {number} step
 * @return {void}
 */
function __position(state, recorderState, step) {
  if (_grounded(state) && recorderState.down()) return
  const run =
    recorderState.combo(false, recorder.Mask.LEFT, recorder.Mask.LEFT) ||
    recorderState.combo(false, recorder.Mask.RIGHT, recorder.Mask.RIGHT)
  const speed = (run ? 0.048 : 0.016) * step
  const x = Math.max(
    0,
    state.position.x -
      (recorderState.left() ? speed : 0) +
      (recorderState.right() ? speed : 0)
  )
  const y = Math.min(
    -17,
    state.position.y -
      (recorderState.up() ? speed : 0) +
      (recorderState.down() ? speed : 0)
  )
  state.position.x = x
  state.position.y = y
}
