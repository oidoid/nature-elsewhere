import * as recorder from '../inputs/recorder.js'
import {Animatable} from '../textures/animatable.js'
import {DrawOrder} from '../textures/draw-order.js'

/** @typedef {import('../textures/atlas.js').Atlas} Atlas} */

export class Entity {
  constructor() {
    /** @type {ReadonlyArray<Animatable>} */ this._animatables = []
    /** @type {XY} */ this._speed = {x: 0, y: 0}
  }

  /** @return {ReadonlyArray<Animatable>} */
  getAnimatables() {
    return this._animatables
  }

  /**
   * @arg {ReadonlyArray<Animatable>} animatables
   * @return {void}
   */
  setAnimatables(animatables) {
    this._animatables = animatables
  }

  getPosition() {
    if (this._animatables.length) return this._animatables[0].getPosition()
    throw new Error()
  }

  /** @return {XY} */
  getSpeed() {
    return this._speed
  }

  /**
   * @arg {XY} speed
   * @return {void}
   */
  setSpeed(speed) {
    this._speed = speed
  }

  /** @return {DrawOrder} */
  getDrawOrder() {
    throw new Error('drawOrder unspecified.')
  }

  /**
   * @arg {number} step
   * @arg {Atlas} atlas
   * @arg {recorder.ReadState} recorder
   * @return {void}
   */
  step(step, atlas, recorder) {
    this._animatables.forEach(animation => {
      animation.step(
        step,
        atlas.animations[animation.getAnimationID()],
        recorder
      )
      animation._position.x += step * this._speed.x
      animation._position.y += step * this._speed.y
    })
  }
}
