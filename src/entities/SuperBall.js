import * as animation from './animation.js'
import * as entity from './entity.js'

export default class SuperBall extends entity.State {
  /**
   * @arg {XY} position
   * @arg {XY} speed
   */
  constructor(position, speed) {
    super(
      entity.Type.SUPER_BALL,
      position,
      animation.ID.PALETTE_GOLD,
      entity.DrawOrder.SUPER_BALL,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 0},
      speed
    )
  }
}
