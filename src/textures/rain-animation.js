import {Animation} from './animation.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

export class RainAnimation extends Animation {
  /**
   * @arg {XY} position
   * @arg {number} scrollSpeed
   */
  constructor(position, scrollSpeed) {
    super(position, {x: 1, y: 1}, {x: 0, y: scrollSpeed})
  }

  /** @return {AnimationID} */
  get animationID() {
    return AnimationID.RAIN
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.CLOUDS
  }
}
