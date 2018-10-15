import * as animation from './animation.js'
import * as entity from './entity.js'

export default class Rain extends entity.State {
  /**
   * @arg {XY} position
   * @arg {number} scrollSpeed
   * @arg {number} speed
   */
  constructor(position, scrollSpeed, speed) {
    super(
      position,
      animation.ID.RAIN,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: scrollSpeed},
      {x: speed, y: 0}
    )
  }

  /** @return {entity.DrawOrder} */
  get drawOrder() {
    return entity.DrawOrder.CLOUDS
  }
}
