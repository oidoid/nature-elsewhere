import {Animation} from './animation.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

export class BackgroundAnimation extends Animation {
  /**
   * @arg {XY} position
   * @arg {XY} scale
   */
  constructor(position, scale) {
    super(position, scale)
  }

  /** @return {AnimationID} */
  get animationID() {
    return AnimationID.PALETTE_PALE
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.BACKGROUND
  }
}
