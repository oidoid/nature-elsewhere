import {Animation} from '../textures/animation.js'
import {AnimationID} from '../textures/animation-id.js'
import {DrawOrder} from '../textures/draw-order.js'

export class Hill extends Animation {
  /** @arg {XY} position */
  constructor(position) {
    super(position, AnimationID.HILL)
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.FAR_BACKGROUND_SCENERY
  }
}
