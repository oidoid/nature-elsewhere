import {Animation} from '../textures/animation.js'
import {AnimationID} from '../textures/animation-id.js'
import {DrawOrder} from '../textures/draw-order.js'

export class Grass extends Animation {
  /**
   * @arg {AnimationID} animationID
   * @arg {XY} position
   * @arg {XY} scale
   */
  constructor(animationID, position, scale = {x: 1, y: 1}) {
    super(position, animationID, {x: 0, y: 0}, scale)
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return this._animationID >= AnimationID.GRASS_XS &&
      this._animationID <= AnimationID.GRASS_L
      ? DrawOrder.FAR_BACKGROUND_SCENERY
      : DrawOrder.FOREGROUND_SCENERY
  }
}
