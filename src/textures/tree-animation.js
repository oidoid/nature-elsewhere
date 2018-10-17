import {Animation} from './animation.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

export class TreeAnimation extends Animation {
  constructor() {
    super(AnimationID.TREE, DrawOrder.NEAR_BACKGROUND_SCENERY)
  }
}
