import {Animation} from '../textures/animation.js'
import {AnimationID} from '../textures/animation-id.js'
import {DrawOrder} from '../textures/draw-order.js'

export class SuperBallAnimation extends Animation {
  /** @arg {XY} position */
  constructor(position) {
    super(AnimationID.PALETTE_LIGHT_BLUE_TINT, position)
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.SUPER_BALL
  }
}
