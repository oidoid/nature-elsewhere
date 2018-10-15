import * as animation from './animation.js'
import * as entity from './entity.js'

export default class Background extends entity.State {
  /**
   * @arg {XY} position
   * @arg {XY} scale
   */
  constructor(position, scale) {
    super(position, animation.ID.PALETTE_PALE, {x: 0, y: 0}, scale)
  }
}
