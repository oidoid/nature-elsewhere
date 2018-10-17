import * as util from '../util.js'
import {Animation} from '../textures/animation.js'
import {AnimationID} from '../textures/animation-id.js'
import {Entity} from './entity.js'
import {CloudAnimation} from '../textures/cloud-animation.js'
import {DrawOrder} from '../textures/draw-order.js'
import {RainAnimation} from '../textures/rain-animation.js'
import {WaterAnimation} from '../textures/water-animation.js'

export class RainCloud extends Entity {
  /**
   * @arg {AnimationID} animationID
   * @arg {XY} position
   * @arg {number} speed
   */
  constructor(animationID, {x, y}, speed) {
    /** @type {Animation[]} */ const animations = []
    util.range(0, (-27 - y) / 16).forEach(i =>
      animations.push(
        new RainAnimation()
          .setPosition({
            // Round now to prevent rain from being an extra pixel off due to
            // truncation later.
            x: x + Math.round((i + 1) / 2),
            y: y + 6 + i * 16 - Math.max(0, y + 6 + i * 16 - -12)
          })
          .setScrollSpeed({
            x: 0,
            y: -0.012
          })
      )
    )

    animations.push(new WaterAnimation().setPosition({x: x + 1, y: -12}))
    animations.push(new CloudAnimation(animationID).setPosition({x, y}))

    super(animations, {x: speed, y: 0})
  }

  /** @return {DrawOrder} */
  getDrawOrder() {
    return DrawOrder.CLOUDS
  }
}
