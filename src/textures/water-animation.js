import {Animation} from './animation.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

export class WaterAnimation extends Animation {
  constructor() {
    super(AnimationID.WATER_M, DrawOrder.CLOUDS)
  }
}
