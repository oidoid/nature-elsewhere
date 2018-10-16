import * as animation from '../textures/animation-id.js'
import {Entity} from './entity.js'

export class Background extends Entity {
  /**
   * @arg {XY} position
   * @arg {XY} scale
   */
  constructor(position, scale) {
    super(position, animation.AnimationID.PALETTE_PALE, {x: 0, y: 0}, scale)
  }
}
