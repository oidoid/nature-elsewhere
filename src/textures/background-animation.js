import {Animation} from './animation.js'
import {AnimationID} from './animation-id.js'
import {DrawOrder} from './draw-order.js'

export class BackgroundAnimation extends Animation {
  constructor() {
    super(AnimationID.PALETTE_PALE, DrawOrder.BACKGROUND)
  }
}
