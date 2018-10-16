import {Animation} from '../textures/animation.js'
import {AnimationID} from '../textures/animation-id.js'
import {DrawOrder} from '../textures/draw-order.js'

export class Tree extends Animation {
  /** @arg {XY} position */
  constructor(position) {
    super(position, AnimationID.TREE)
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.NEAR_BACKGROUND_SCENERY
  }
}
