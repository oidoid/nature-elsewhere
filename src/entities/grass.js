import * as animation from '../textures/animation-id.js'
import * as entity from './entity.js'
import {DrawOrder} from './draw-order.js'

export class Grass extends entity.Entity {
  /**
   * @arg {animation.AnimationID} animationID
   * @arg {XY} position
   * @arg {XY} scale
   */
  constructor(animationID, position, scale = {x: 1, y: 1}) {
    super(position, animationID, {x: 0, y: 0}, scale)
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return this._animationID >= animation.AnimationID.GRASS_XS &&
      this._animationID <= animation.AnimationID.GRASS_L
      ? DrawOrder.FAR_BACKGROUND_SCENERY
      : DrawOrder.FOREGROUND_SCENERY
  }
}
