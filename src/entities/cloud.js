import {Animation} from '../textures/animation.js'
import {AnimationID} from '../textures/animation-id.js'
import {DrawOrder} from '../textures/draw-order.js'

export class Cloud extends Animation {
  /**
   * @arg {AnimationID} animationID
   * @arg {XY} position
   * @arg {XY} [speed]
   */
  constructor(animationID, position, speed) {
    super(
      position,
      animationID,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 0},
      speed
    )
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.CLOUDS
  }
}
