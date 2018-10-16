import {Animation} from './animation.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

export class TreeAnimation extends Animation {
  /** @arg {XY} position */
  constructor(position) {
    super(AnimationID.TREE, position)
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.NEAR_BACKGROUND_SCENERY
  }
}
