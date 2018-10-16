import * as atlas from './atlas.js'
import * as recorder from '../inputs/recorder.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

export class Drawable {
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
    /** @type {Mutable<XY>} */ this._position = position
    /** @type {Mutable<XY>} */ this._scale = scale
    /** @type {XY} */ this._scrollSpeed = scrollSpeed
    /** @type {Mutable<XY>} */ this._scrollPosition = scrollPosition
  }

  /** @return {AnimationID} */
  get animationID() {
    return this._animationID
  }

  /** @return {XY} */
  get position() {
    return this._position
  }

  /**
   * @arg {XY} position
   * @return {void}
   */
  set position(position) {
    this._position = position
  }

  /** @return {XY} */
  get scale() {
    return this._scale
  }

  /** @return {XY} */
  get scrollSpeed() {
    return this._scrollSpeed
  }

  /** @return {XY} */
  get scrollPosition() {
    return this._scrollPosition
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.BACKGROUND
  }

  /**
   * @arg {number} step
   * @arg {atlas.Animation} _animation
   * @arg {recorder.ReadState} _recorder
   * @return {void}
   */
  step(step, _animation, _recorder) {
    this._scrollPosition.x += step * this._scrollSpeed.x
    this._scrollPosition.y += step * this._scrollSpeed.y
  }
}
