import * as animation from '../textures/animation-id.js'
import * as entity from './entity.js'
import {DrawOrder} from './draw-order.js'

export class Water extends entity.Entity {
  /**
   * @arg {XY} position
   * @arg {number} speed
   */
  constructor(position, speed) {
    super(
      position,
      animation.AnimationID.WATER_M,
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
