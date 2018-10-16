import {Animation} from '../textures/animation.js'
import {AnimationID} from '../textures/animation-id.js'
import {DrawOrder} from '../textures/draw-order.js'

export class SuperBall extends Animation {
  /**
   * @arg {XY} position
   * @arg {XY} speed
   */
  constructor(position, speed) {
    super(
      position,
      AnimationID.PALETTE_LIGHT_BLUE_TINT,
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
