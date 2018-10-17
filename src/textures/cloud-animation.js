import {Animation} from '../textures/animation.js'
import {AnimationID} from '../textures/animation-id.js'
import {DrawOrder} from '../textures/draw-order.js'

export class CloudAnimation extends Animation {
  /** @arg {AnimationID} animationID */
  constructor(animationID) {
    super(animationID, DrawOrder.CLOUDS)
  }
}
