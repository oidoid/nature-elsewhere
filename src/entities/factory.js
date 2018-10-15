import * as animation from './animation.js'
import * as entity from './entity.js'
import * as util from '../util.js'
import Rain from './Rain.js'
import Cloud from './Cloud.js'
import Water from './Water.js'

/**
 * @arg {animation.ID} animationID
 * @arg {XY} position
 * @arg {number} speed
 * @return {ReadonlyArray<entity.State>}
 */
export function newRainCloud(animationID, {x, y}, speed) {
  /** @type {entity.State[]} */ const entities = []
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
  return entities
}
