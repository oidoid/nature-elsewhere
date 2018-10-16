import {Animation} from '../textures/animation.js'
import {AnimationID} from '../textures/animation-id.js'
import {DrawOrder} from '../textures/draw-order.js'

export class Water extends Animation {
  /**
   * @arg {XY} position
   * @arg {number} speed
   */
  constructor(position, speed) {
    super(
      position,
      AnimationID.WATER_M,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 0},
      {x: speed, y: 0}
    )
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.CLOUDS
  }
}
