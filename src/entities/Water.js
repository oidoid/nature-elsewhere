import * as animation from './animation.js'
import * as entity from './entity.js'

export default class Water extends entity.State {
  /**
   * @arg {XY} position
   * @arg {number} speed
   */
  constructor(position, speed) {
    super(
      position,
      animation.ID.WATER_M,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 0},
      {x: speed, y: 0}
    )
  }

  /** @return {entity.DrawOrder} */
  get drawOrder() {
    return entity.DrawOrder.CLOUDS
  }
}
