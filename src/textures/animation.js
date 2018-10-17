import * as atlas from './atlas.js'
import * as recorder from '../inputs/recorder.js'
import {AnimationID} from './animation-id.js'
import {Animator} from './animator.js'
import {DrawOrder} from './draw-order.js'
import {Texture} from './texture.js'

export class Animation extends Texture {
  /**
   * @arg {AnimationID} animationID
   * @arg {DrawOrder} drawOrder
   */
  constructor(animationID, drawOrder) {
    super(animationID, drawOrder)
    /** @type {Mutable<XY>} */ this._scrollSpeed = {x: 0, y: 0}
    /** @type {Animator|undefined} */ this._animator = undefined
  }

  /** @return {XY} */
  getScrollSpeed() {
    return this._scrollSpeed
  }

  /**
   * @arg {XY} val
   * @return {this}
   */
  setScrollSpeed(val) {
    this._scrollSpeed = val
    return this
  }

  /**
   * @arg {number} step
   * @arg {atlas.Animation} animation
   * @arg {recorder.ReadState} _recorder
   * @return {void}
   */
  step(step, animation, _recorder) {
    this._scrollPosition.x += step * this._scrollSpeed.x
    this._scrollPosition.y += step * this._scrollSpeed.y
    if (!this._animator || this._animator.getAnimation() !== animation) {
      this._animator = new Animator(animation)
    }
    this._animator.step(step)
  }

  /** @return {Rect} */
  getBounds() {
    return this._animator
      ? this._animator.getBounds()
      : {x: 0, y: 0, w: 0, h: 0}
  }
}
