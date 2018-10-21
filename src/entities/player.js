import * as atlas from '../textures/atlas.js'
import * as recorder from '../inputs/recorder.js'
import {Animatable} from '../textures/animatable.js'
import {AnimationID} from '../textures/animation-id.js'
import {Entity} from './entity.js'
import {DrawOrder} from '../textures/draw-order.js'

export class Player extends Entity {
  constructor() {
    super()
    // This entity always has exactly one animation.
    this.setAnimatables([new Animatable(AnimationID.PLAYER_IDLE)])
  }

  /**
   * @arg {XY} val
   * @return {this}
   */
  setPosition(val) {
    this.getAnimatables().forEach(animation => animation.setPosition(val))
    return this
  }

  /**
   * @arg {number} step
   * @arg {atlas.Atlas} atlas
   * @arg {recorder.ReadState} recorder
   * @return {void}
   */
  step(step, atlas, recorder) {
    this.__scale(recorder)
    this.__position(recorder, step)
    const animationID = this.__animationID(recorder)
    if (animationID !== this.getAnimatables()[0].getAnimationID()) {
      this.setAnimatables([
        new Animatable(animationID)
          .setPosition(this.getAnimatables()[0].getPosition())
          .setScale(this.getAnimatables()[0].getScale())
      ])
    }
    super.step(step, atlas, recorder)
  }

  /** @return {boolean} */
  _grounded() {
    return this.getAnimatables()[0].getPosition().y >= -17
  }

  /**
   * @arg {recorder.ReadState} recorderState
   * @return {AnimationID}
   */
  __animationID(recorderState) {
    const animationID = this.getAnimatables()[0].getAnimationID()
    if (!this._grounded()) {
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
   * @arg {recorder.ReadState} recorderState
   * @return {void}
   */
  __scale(recorderState) {
    this.getAnimatables().forEach(animation => {
      animation.setScale({
        x: recorderState.left()
          ? -1
          : recorderState.right()
            ? 1
            : animation.getScale().x,
        y: animation.getScale().y
      })
    })
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
    this.getAnimatables().forEach(animatable => {
      const x = Math.max(
        0,
        animatable.getPosition().x -
          (recorderState.left() ? speed : 0) +
          (recorderState.right() ? speed : 0)
      )
      const y = Math.min(
        -17,
        animatable.getPosition().y -
          (recorderState.up() ? speed : 0) +
          (recorderState.down() ? speed : 0)
      )
      animatable.setPosition({x, y})
    })
  }

  /** @return {DrawOrder} */
  getDrawOrder() {
    return DrawOrder.PLAYER
  }
}
