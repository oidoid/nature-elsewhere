import * as animation from './animation.js'
import * as entity from './entity.js'

export class Tree extends entity.State {
  /** @arg {XY} position */
  constructor(position) {
    super(
      entity.Type.TREE,
      position,
      animation.ID.TREE,
      entity.DrawOrder.NEAR_BACKGROUND_SCENERY
    )
  }
}
