import * as animation from './animation.js'
import * as atlas from './atlas.js'
import * as entity from './entity.js'
import * as recorder from '../inputs/recorder.js'

export default class Player extends entity.State {
  /** @arg {XY} position */
  constructor(position) {
    super(
      entity.Type.PLAYER,
      position,
      animation.ID.PLAYER_IDLE,
      entity.DrawOrder.PLAYER
    )
  }

  /**
   * @arg {number} step
   * @arg {atlas.State} atlas
   * @arg {recorder.ReadState} recorderState
   * @return {void}
   */
  nextStepState(step, atlas, recorderState) {
    this.__scale(recorderState)
    this.__position(recorderState, step)

    this._animationID = this.__animationID(recorderState)
    const run =
      recorderState.combo(false, recorder.Mask.LEFT, recorder.Mask.LEFT) ||
      recorderState.combo(false, recorder.Mask.RIGHT, recorder.Mask.RIGHT)
    this._cel =
      Math.abs(Math.round(this._position.x / (run ? 6 : 2))) %
      atlas.animations[this._animationID].cels.length
  }

  /** @return {boolean} */
  _grounded() {
    return this._position.y >= -17
  }

  /**
   * @arg {recorder.ReadState} recorderState
   * @return {animation.ID}
   */
  __animationID(recorderState) {
    if (!this._grounded()) {
      if (recorderState.up()) {
        return animation.ID.PLAYER_ASCEND
      }

      return animation.ID.PLAYER_DESCEND
    }

    if (
      recorderState.down(true) &&
      (this._animationID === animation.ID.PLAYER_CROUCH ||
        this._animationID === animation.ID.PLAYER_SIT)
    ) {
      return animation.ID.PLAYER_SIT
    }

    if (recorderState.down()) {
      if (
        this._animationID === animation.ID.PLAYER_CROUCH ||
        this._animationID === animation.ID.PLAYER_SIT
      ) {
        return this._animationID
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
      if (this._animationID === animation.ID.PLAYER_SIT) {
        return animation.ID.PLAYER_CROUCH
      }
      return animation.ID.PLAYER_IDLE
    }

    if (
      this._animationID === animation.ID.PLAYER_CROUCH ||
      this._animationID === animation.ID.PLAYER_SIT
    ) {
      return this._animationID
    }

    return animation.ID.PLAYER_IDLE
  }

  /**
   * @arg {recorder.ReadState} recorderState
   * @return {void}
   */
  __scale(recorderState) {
    this._scale.x = recorderState.left()
      ? -1
      : recorderState.right()
        ? 1
        : this._scale.x
  }

  /**
   * @arg {recorder.ReadState} recorderState
   * @arg {number} step
   * @return {void}
   */
  __position(recorderState, step) {
    if (this._grounded() && recorderState.down()) return
    const run =
      recorderState.combo(false, recorder.Mask.LEFT, recorder.Mask.LEFT) ||
      recorderState.combo(false, recorder.Mask.RIGHT, recorder.Mask.RIGHT)
    const speed = (run ? 0.048 : 0.016) * step
    this._position.x = Math.max(
      0,
      this._position.x -
        (recorderState.left() ? speed : 0) +
        (recorderState.right() ? speed : 0)
    )
    this._position.y = Math.min(
      -17,
      this._position.y -
        (recorderState.up() ? speed : 0) +
        (recorderState.down() ? speed : 0)
    )
  }
}
