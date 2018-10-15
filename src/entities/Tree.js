import * as animation from './animation.js'
import * as entity from './entity.js'

export default class Tree extends entity.State {
  /** @arg {XY} position */
  constructor(position) {
    super(position, animation.ID.TREE)
  }

  /** @return {entity.DrawOrder} */
  get drawOrder() {
    return entity.DrawOrder.NEAR_BACKGROUND_SCENERY
  }
}
