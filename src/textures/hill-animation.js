import {Animation} from './animation.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

export class HillAnimation extends Animation {
  constructor() {
    super(AnimationID.HILL, DrawOrder.FAR_BACKGROUND_SCENERY)
  }
}
