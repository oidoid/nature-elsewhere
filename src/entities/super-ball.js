import * as animation from '../textures/animation-id.js'
import * as entity from './entity.js'
import {DrawOrder} from './draw-order.js'

export class SuperBall extends entity.Entity {
  /**
   * @arg {XY} position
   * @arg {XY} speed
   */
  constructor(position, speed) {
    super(
      position,
      animation.AnimationID.PALETTE_LIGHT_BLUE_TINT,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 0},
      speed
    )
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.SUPER_BALL
  }
}
