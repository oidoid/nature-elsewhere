import * as animation from './animation.js'
import * as entity from './entity.js'

export default class Grass extends entity.State {
  /**
   * @arg {animation.ID} animationID
   * @arg {XY} position
   * @arg {XY} scale
   */
  constructor(animationID, position, scale = {x: 1, y: 1}) {
    const drawOrder =
      animationID >= animation.ID.GRASS_XS &&
      animationID <= animation.ID.GRASS_L
        ? entity.DrawOrder.FAR_BACKGROUND_SCENERY
        : entity.DrawOrder.FOREGROUND_SCENERY
    super(
      entity.Type.GRASS,
      position,
      animationID,
      drawOrder,
      {x: 0, y: 0},
      scale
    )
  }
}
