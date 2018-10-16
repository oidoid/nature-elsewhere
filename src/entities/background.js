import * as animation from '../textures/animation-id.js'
import {Animation} from '../textures/animation.js'

export class Background extends Animation {
  /**
   * @arg {XY} position
   * @arg {XY} scale
   */
  constructor(position, scale) {
    super(position, animation.AnimationID.PALETTE_PALE, {x: 0, y: 0}, scale)
  }
}
