import * as animation from './animation.js'
import * as entity from './entity.js'

export default class Hill extends entity.State {
  /** @arg {XY} position */
  constructor(position) {
    super(position, animation.ID.HILL)
  }

  /** @return {entity.DrawOrder} */
  get drawOrder() {
    return entity.DrawOrder.FAR_BACKGROUND_SCENERY
  }
}
