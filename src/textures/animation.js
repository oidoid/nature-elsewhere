import * as recorder from '../inputs/recorder.js'
import {Animator} from './animator.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

/** @typedef {import('../entities/player.js').Atlas} Atlas */

export class Animation {
  /**
   * @arg {XY} position
   * @arg {AnimationID} animationID
   * @arg {XY} [scrollPosition]
   * @arg {XY} [scale]
   * @arg {XY} [scrollSpeed]
   * @arg {XY} [speed]
   */
  constructor(
    position,
    animationID,
    scrollPosition = {x: 0, y: 0},
    scale = {x: 1, y: 1},
    scrollSpeed = {x: 0, y: 0},
    speed = {x: 0, y: 0}
  ) {
    /** @type {Mutable<XY>} */ this._position = position
    /** @type {AnimationID} */ this._animationID = animationID
    /** @type {Animator} */ this._animator = new Animator()
    /** @type {Mutable<XY>} */ this._scrollPosition = scrollPosition
    /** @type {Mutable<XY>} */ this._scale = scale
    /** @type {XY} */ this.scrollSpeed = scrollSpeed
    /** @type {XY} */ this._speed = speed
  }

  /**
   * @arg {number} step
   * @arg {Atlas} atlas
   * @arg {recorder.ReadState} _recorder
   * @return {void}
   */
  step(step, atlas, _recorder) {
    this._animator.animation = atlas.animations[this._animationID]
    this._animator.step(step)
    this._position.x += step * this._speed.x
    this._position.y += step * this._speed.y
    this._scrollPosition.x += step * this.scrollSpeed.x
    this._scrollPosition.y += step * this.scrollSpeed.y
  }

  /** @return {Rect} */
  get bounds() {
    return this._animator.cel.bounds
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.BACKGROUND
  }
}
