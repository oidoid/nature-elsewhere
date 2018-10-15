import * as animation from '../textures/animationID.js'
import * as entity from './entity.js'

export class Cloud extends entity.Entity {
  /**
   * @arg {animation.AnimationID} animationID
   * @arg {XY} position
   * @arg {XY} [speed]
   */
  constructor(animationID, position, speed) {
    super(
      position,
      animationID,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 0},
      speed
    )
  }

  /** @return {entity.DrawOrder} */
  get drawOrder() {
    return entity.DrawOrder.CLOUDS
  }
}
