import * as animation from './animation.js'
import * as entity from './entity.js'

export default class Grass extends entity.State {
  /**
   * @arg {animation.ID} animationID
   * @arg {XY} position
   * @arg {XY} scale
   */
  constructor(animationID, position, scale = {x: 1, y: 1}) {
    super(position, animationID, {x: 0, y: 0}, scale)
  }

  /** @return {entity.DrawOrder} */
  get drawOrder() {
    return this._animationID >= animation.ID.GRASS_XS &&
      this._animationID <= animation.ID.GRASS_L
      ? entity.DrawOrder.FAR_BACKGROUND_SCENERY
      : entity.DrawOrder.FOREGROUND_SCENERY
  }
}
