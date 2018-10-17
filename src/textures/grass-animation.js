import {Animation} from './animation.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

export class GrassAnimation extends Animation {
  /** @arg {AnimationID} animationID */
  constructor(animationID) {
    const drawOrder =
      animationID >= AnimationID.GRASS_XS && animationID <= AnimationID.GRASS_L
        ? DrawOrder.FAR_BACKGROUND_SCENERY
        : DrawOrder.FOREGROUND_SCENERY
    super(animationID, drawOrder)
  }
}
