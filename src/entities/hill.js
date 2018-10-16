import * as animation from '../textures/animation-id.js'
import * as entity from './entity.js'

export class Hill extends entity.Entity {
  /** @arg {XY} position */
  constructor(position) {
    super(position, animation.AnimationID.HILL)
  }

  /** @return {entity.DrawOrder} */
  get drawOrder() {
    return entity.DrawOrder.FAR_BACKGROUND_SCENERY
  }
}
