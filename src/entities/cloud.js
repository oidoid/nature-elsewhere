import {AnimationID} from '../textures/animation-id.js'
import {DrawOrder} from '../textures/draw-order.js'
import {Entity} from './entity.js'
import {CloudAnimation} from '../textures/cloud-animation.js'

export class Cloud extends Entity {
  /**
   * @arg {AnimationID} animationID
   * @arg {XY} position
   * @arg {XY} [speed]
   */
  constructor(animationID, position, speed) {
    super([new CloudAnimation(animationID).setPosition(position)], speed)
  }

  /** @return {DrawOrder} */
  getDrawOrder() {
    return DrawOrder.CLOUDS
  }
}
