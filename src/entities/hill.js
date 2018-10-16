import * as animation from '../textures/animation-id.js'
import * as entity from './entity.js'
import {DrawOrder} from './draw-order.js'

export class Hill extends entity.Entity {
  /** @arg {XY} position */
  constructor(position) {
    super(position, animation.AnimationID.HILL)
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.FAR_BACKGROUND_SCENERY
  }
}
