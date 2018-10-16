import {Animation} from './animation.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

export class GrassAnimation extends Animation {
  /**
   * @arg {AnimationID} animationID
   * @arg {XY} position
   * @arg {XY} scale
   */
  constructor(animationID, position, scale = {x: 1, y: 1}) {
    super(animationID, position, scale)
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return this._animationID >= AnimationID.GRASS_XS &&
      this._animationID <= AnimationID.GRASS_L
      ? DrawOrder.FAR_BACKGROUND_SCENERY
      : DrawOrder.FOREGROUND_SCENERY
  }
}
