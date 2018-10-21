import {AnimationDrawOrder} from './animation-draw-order.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

export class Drawable {
  /** @param {AnimationID} animationID */
  constructor(animationID) {
    /** @type {AnimationID} */ this._animationID = animationID
    /** @type {Mutable<XY>} */ this._position = {x: 0, y: 0}
    /** @type {Mutable<XY>} */ this._scale = {x: 1, y: 1}
    /** @type {Mutable<XY>} */ this._scrollPosition = {x: 0, y: 0}
  }

  /** @return {AnimationID} */
  getAnimationID() {
    return this._animationID
  }

  /**
   * @arg {AnimationID} val
   * @return {this}
   */
  setAnimationID(val) {
    this._animationID = val
    return this
  }

  /** @return {DrawOrder} */
  getDrawOrder() {
    return AnimationDrawOrder[this._animationID]
  }

  /**
   * @arg {DrawOrder} val
   * @return {this}
   */
  setDrawOrder(val) {
    this._drawOrder = val
    return this
  }

  /** @return {XY} */
  getPosition() {
    return this._position
  }

  /**
   * @arg {XY} val
   * @return {this}
   */
  setPosition(val) {
    this._position = val
    return this
  }

  /** @return {XY} */
  getScale() {
    return this._scale
  }

  /**
   * @arg {XY} val
   * @return {this}
   */
  setScale(val) {
    this._scale = val
    return this
  }

  /** @return {XY} */
  getScrollPosition() {
    return this._scrollPosition
  }

  /**
   * @arg {XY} val
   * @return {this}
   */
  setScrollPosition(val) {
    this._scrollPosition = val
    return this
  }
}
