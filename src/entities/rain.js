import * as animation from '../textures/animation-id.js'
import * as entity from './entity.js'
import {DrawOrder} from './draw-order.js'

export class Rain extends entity.Entity {
  /**
   * @arg {XY} position
   * @arg {number} scrollSpeed
   * @arg {number} speed
   */
  constructor(position, scrollSpeed, speed) {
    super(
      position,
      animation.AnimationID.RAIN,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: scrollSpeed},
      {x: speed, y: 0}
    )
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.CLOUDS
  }
}
