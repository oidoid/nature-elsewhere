import * as recorder from '../inputs/recorder.js'
import {Animation} from '../textures/animation.js'
import {DrawOrder} from '../textures/draw-order.js'

/** @typedef {import('../textures/atlas.js').Atlas} Atlas} */

export class Entity {
  /**
   * @arg {ReadonlyArray<Animation>} animations
   * @arg {XY} [speed]
   */
  constructor(animations, speed = {x: 0, y: 0}) {
    /** @type {ReadonlyArray<Animation>} */ this._animations = animations
    /** @type {XY} */ this._speed = speed
  }

  /** @return {ReadonlyArray<Animation>} */
  get animations() {
    return this._animations
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.DEFAULT
  }

  /**
   * @arg {number} step
   * @arg {Atlas} atlas
   * @arg {recorder.ReadState} recorder
   * @return {void}
   */
  step(step, atlas, recorder) {
    this._animations.forEach(animation => {
      animation.step(step, atlas, recorder)
      animation._position.x += step * this._speed.x
      animation._position.y += step * this._speed.y
    })
  }
}
