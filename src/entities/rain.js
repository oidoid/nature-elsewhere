import {Animation} from '../textures/animation.js'
import {AnimationID} from '../textures/animation-id.js'
import {DrawOrder} from '../textures/draw-order.js'

export class Rain extends Animation {
  /**
   * @arg {XY} position
   * @arg {number} scrollSpeed
   * @arg {number} speed
   */
  constructor(position, scrollSpeed, speed) {
    super(
      position,
      AnimationID.RAIN,
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
