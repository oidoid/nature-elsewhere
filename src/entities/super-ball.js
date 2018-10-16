import * as animation from '../textures/animation-id.js'
import * as entity from './entity.js'

export class SuperBall extends entity.Entity {
  /**
   * @arg {XY} position
   * @arg {XY} speed
   */
  constructor(position, speed) {
    super(
      position,
      animation.AnimationID.PALETTE_GOLD,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 0},
      speed
    )
  }

  /** @return {entity.DrawOrder} */
  get drawOrder() {
    return entity.DrawOrder.SUPER_BALL
  }
}
