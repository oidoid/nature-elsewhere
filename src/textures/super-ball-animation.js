import {Animation} from '../textures/animation.js'
import {AnimationID} from '../textures/animation-id.js'
import {DrawOrder} from '../textures/draw-order.js'

export class SuperBallAnimation extends Animation {
  constructor() {
    super(AnimationID.PALETTE_LIGHT_BLUE_TINT, DrawOrder.SUPER_BALL)
  }
}
