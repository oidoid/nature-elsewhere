import * as animation from './animation.js'
import * as entity from './entity.js'

export default class Background extends entity.State {
  /**
   * @arg {XY} position
   * @arg {XY} scale
   */
  constructor(position, scale) {
    super(
      entity.Type.BACKGROUND,
      position,
      animation.ID.PALETTE_PALE,
      entity.DrawOrder.BACKGROUND,
      {x: 0, y: 0},
      scale
    )
  }
}
