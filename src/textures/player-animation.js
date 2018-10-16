import * as recorder from '../inputs/recorder.js'
import {Animation} from './animation.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

/** @typedef {import('./atlas.js').Atlas} Atlas} */

export class PlayerAnimation extends Animation {
  /** @arg {XY} position */
  constructor(position) {
    super(AnimationID.PLAYER_IDLE, position)
  }

  /**
   * @arg {number} step
   * @arg {Atlas} atlas
   * @arg {recorder.ReadState} recorder
   * @return {void}
   */
  step(step, atlas, recorder) {
    this.__scale(recorder)
    this.__position(recorder, step)

    this._animationID = this.__animationID(recorder)
    this._animator.animation = atlas.animations[this._animationID]
    this._animator.step(step)
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.PLAYER
  }

  /** @return {boolean} */
  _grounded() {
    return this._position.y >= -17
  }

  /**
   * @arg {recorder.ReadState} recorderState
   * @return {AnimationID}
   */
  __animationID(recorderState) {
    if (!this._grounded()) {
      if (recorderState.up()) {
        return AnimationID.PLAYER_ASCEND
      }

      return AnimationID.PLAYER_DESCEND
    }

    if (
      recorderState.down(true) &&
      (this._animationID === AnimationID.PLAYER_CROUCH ||
        this._animationID === AnimationID.PLAYER_SIT)
    ) {
      return AnimationID.PLAYER_SIT
    }

    if (recorderState.down()) {
      if (
        this._animationID === AnimationID.PLAYER_CROUCH ||
        this._animationID === AnimationID.PLAYER_SIT
      ) {
        return this._animationID
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
      if (this._animationID === AnimationID.PLAYER_SIT) {
        return AnimationID.PLAYER_CROUCH
      }
      return AnimationID.PLAYER_IDLE
    }

    if (
      this._animationID === AnimationID.PLAYER_CROUCH ||
      this._animationID === AnimationID.PLAYER_SIT
    ) {
      return this._animationID
    }

    return AnimationID.PLAYER_IDLE
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
