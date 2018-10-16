import {Animation} from './animation.js'
import {AnimationID} from './animation-id.js'

export class BackgroundAnimation extends Animation {
  /**
   * @arg {XY} position
   * @arg {XY} scale
   */
  constructor(position, scale) {
    super(AnimationID.PALETTE_PALE, position, scale)
  }
}
