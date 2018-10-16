import * as animation from '../textures/animation-id.js'
import * as entity from './entity.js'
import {DrawOrder} from './draw-order.js'

export class Tree extends entity.Entity {
  /** @arg {XY} position */
  constructor(position) {
    super(position, animation.AnimationID.TREE)
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.NEAR_BACKGROUND_SCENERY
  }
}
