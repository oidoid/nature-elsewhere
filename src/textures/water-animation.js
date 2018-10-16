import {Animation} from './animation.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

export class WaterAnimation extends Animation {
  /** @arg {XY} position */
  constructor(position) {
    super(AnimationID.WATER_M, position)
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.CLOUDS
  }
}
