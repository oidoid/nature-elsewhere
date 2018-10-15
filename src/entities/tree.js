import * as animation from '../textures/animationID.js'
import * as entity from './entity.js'

export class Tree extends entity.Entity {
  /** @arg {XY} position */
  constructor(position) {
    super(position, animation.AnimationID.TREE)
  }

  /** @return {entity.DrawOrder} */
  get drawOrder() {
    return entity.DrawOrder.NEAR_BACKGROUND_SCENERY
  }
}
