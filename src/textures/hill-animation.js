import {Animation} from './animation.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

export class HillAnimation extends Animation {
  /** @arg {XY} position */
  constructor(position) {
    super(position)
  }

  /** @return {AnimationID} */
  get animationID() {
    return AnimationID.HILL
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.FAR_BACKGROUND_SCENERY
  }
}
