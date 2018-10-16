import {Animation} from '../textures/animation.js'
import {AnimationID} from '../textures/animation-id.js'
import {DrawOrder} from '../textures/draw-order.js'

export class CloudAnimation extends Animation {
  /**
   * @arg {AnimationID} animationID
   * @arg {XY} position
   */
  constructor(animationID, position) {
    super(position)
    /** @type {AnimationID} */ this._animationID = animationID
  }

  /** @return {AnimationID} */
  get animationID() {
    return this._animationID
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.CLOUDS
  }
}
