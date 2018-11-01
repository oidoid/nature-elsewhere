import * as animatable from '../textures/animatable.js'
import * as recorder from '../inputs/recorder.js'
import {AnimationLayer} from '../assets/animation-layer.js'
import {Layer} from '../textures/layer.js'

/** @typedef {import('../textures/atlas').Atlas} Atlas} */

export class Entity {
  constructor() {
    /** @type {ReadonlyArray<animatable.State>} */ this._animatables = []
    /** @type {XY} */ this._speed = {x: 0, y: 0}
  }

  /** @return {ReadonlyArray<animatable.State>} */
  getAnimatables() {
    return this._animatables
  }

  /**
   * @arg {ReadonlyArray<animatable.State>} animatables
   * @return {void}
   */
  setAnimatables(animatables) {
    this._animatables = animatables
  }

  getPosition() {
    if (this._animatables.length) return this._animatables[0].position
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

  /** @return {Layer} */
  getLayer() {
    if (this._animatables.length) {
      return AnimationLayer[this._animatables[0].animationID]
    }
    throw new Error()
  }

  /**
   * @arg {number} step
   * @arg {Atlas} atlas
   * @arg {recorder.ReadState} _recorder
   * @return {void}
   */
  step(step, atlas, _recorder) {
    this._animatables.forEach(val => {
      animatable.step(val, step, atlas.animations[val.animationID])
      val.position.x += step * this._speed.x
      val.position.y += step * this._speed.y
    })
  }
}
