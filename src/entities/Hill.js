import * as animation from './animation.js'
import * as entity from './entity.js'

export class Hill extends entity.State {
  /** @arg {XY} position */
  constructor(position) {
    super(
      entity.Type.GRASS,
      position,
      animation.ID.HILL,
      entity.DrawOrder.FAR_BACKGROUND_SCENERY
    )
  }
}
