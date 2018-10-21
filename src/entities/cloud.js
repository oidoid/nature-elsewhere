import {Animatable} from '../textures/animatable.js'
import {AnimationID} from '../textures/animation-id.js'
import {DrawOrder} from '../textures/draw-order.js'
import {Entity} from './entity.js'

export class Cloud extends Entity {
  /**
   * @arg {AnimationID} animationID
   * @arg {XY} position
   * @arg {XY} [speed]
   */
  constructor(animationID, position, speed) {
    super()
    this.setAnimatables([new Animatable(animationID).setPosition(position)])
    if (speed) this.setSpeed(speed)
  }

  /** @return {DrawOrder} */
  getDrawOrder() {
    return DrawOrder.CLOUDS
  }
}
