import {Animation} from './animation.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

export class RainAnimation extends Animation {
  constructor() {
    super(AnimationID.RAIN, DrawOrder.CLOUDS)
  }
}
