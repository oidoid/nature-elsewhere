import * as util from '../util.js'
import {Animation} from '../textures/animation.js'
import {AnimationID} from '../textures/animation-id.js'
import {Entity} from './entity.js'
import {Cloud} from './cloud.js'
import {DrawOrder} from '../textures/draw-order.js'
import {Rain} from './rain.js'
import {Water} from './water.js'

export class RainCloud extends Entity {
  /**
   * @arg {AnimationID} animationID
   * @arg {XY} position
   * @arg {number} speed
   */
  constructor(animationID, {x, y}, speed) {
    /** @type {Animation[]} */ const entities = []
    util.range(0, (-27 - y) / 16).forEach(i =>
      entities.push(
        new Rain(
          {
            // Round now to prevent rain from being an extra pixel off due to
            // truncation later.
            x: x + Math.round((i + 1) / 2),
            y: y + 6 + i * 16 - Math.max(0, y + 6 + i * 16 - -12)
          },
          -0.012,
          speed
        )
      )
    )
    entities.push(new Water({x: x + 1, y: -12}, speed))
    entities.push(new Cloud(animationID, {x, y}, {x: speed, y: 0}))

    super(entities)
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.CLOUDS
  }
}
