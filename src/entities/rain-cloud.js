import * as util from '../util.js'
import {Animatable} from '../textures/animatable.js'
import {AnimationID} from '../textures/animation-id.js'
import {Entity} from './entity.js'
import {DrawOrder} from '../textures/draw-order.js'

export class RainCloud extends Entity {
  /**
   * @arg {AnimationID} animationID
   * @arg {XY} position
   * @arg {number} speed
   */
  constructor(animationID, {x, y}, speed) {
    super()
    /** @type {Animatable[]} */ const animatables = []
    util.range(0, (-27 - y) / 16).forEach(i =>
      animatables.push(
        new Animatable(AnimationID.RAIN)
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

    animatables.push(
      new Animatable(AnimationID.WATER_M).setPosition({x: x + 1, y: -12})
    )
    animatables.push(new Animatable(animationID).setPosition({x, y}))

    this.setAnimatables(animatables)
    this.setSpeed({x: speed, y: 0})
  }

  /** @return {DrawOrder} */
  getDrawOrder() {
    return DrawOrder.CLOUDS
  }
}
