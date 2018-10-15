import * as animation from './animation.js'
import * as entity from './entity.js'

export default class SuperBall extends entity.State {
  /**
   * @arg {XY} position
   * @arg {XY} speed
   */
  constructor(position, speed) {
    super(
      position,
      animation.ID.PALETTE_GOLD,
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
