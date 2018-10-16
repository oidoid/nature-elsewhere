import * as recorder from '../inputs/recorder.js'
import {Animator} from './animator.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

/** @typedef {import('./player-animation.js').Atlas} Atlas */

export class Animation {
  /**
   * @arg {AnimationID} animationID
   * @arg {XY} [position]
   * @arg {XY} [scale]
   * @arg {XY} [scrollSpeed]
   * @arg {XY} [scrollPosition]
   */
  constructor(
    animationID,
    position = {x: 0, y: 0},
    scale = {x: 1, y: 1},
    scrollSpeed = {x: 0, y: 0},
    scrollPosition = {x: 0, y: 0}
  ) {
    /** @type {AnimationID} */ this._animationID = animationID
    /** @type {Animator} */ this._animator = new Animator()
    /** @type {Mutable<XY>} */ this._position = position
    /** @type {Mutable<XY>} */ this._scale = scale
    /** @type {XY} */ this.scrollSpeed = scrollSpeed
    /** @type {Mutable<XY>} */ this._scrollPosition = scrollPosition
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
