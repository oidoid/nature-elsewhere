import * as animation from './animation.js'
import * as entity from './entity.js'

export default class Cloud extends entity.State {
  /**
   * @arg {XY} position
   * @arg {animation.ID} animationID
   */
  constructor(position, animationID) {
    super(entity.Type.CLOUD, position, animationID, entity.DrawOrder.CLOUDS)
  }
}
