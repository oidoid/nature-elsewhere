import {DrawOrder} from '../textures/draw-order.js'
import {Entity} from './entity.js'
import {Animatable} from '../textures/animatable.js'
import {AnimationID} from '../assets/animation-id.js'

export class SuperBall extends Entity {
  /**
   * @arg {XY} position
   * @arg {XY} speed
   */
  constructor(position, speed) {
    super()
    this.setAnimatables([
      new Animatable(AnimationID.PALETTE_LIGHT_BLUE_TINT).setPosition(position)
    ])
    this.setSpeed(speed)
  }

  /** @return {DrawOrder} */
  getDrawOrder() {
    return DrawOrder.SUPER_BALL
  }
}
