import * as animation from './animation.js'
import * as entity from './entity.js'
import * as util from '../util.js'

/**
 * @arg {animation.ID} animationID
 * @arg {XY} position
 * @arg {number} speed
 * @return {ReadonlyArray<entity.State>}
 */
export function newRainCloud(animationID, {x, y}, speed) {
  /** @type {entity.State[]} */ const entities = []
  const drawOrder = entity.DrawOrder.CLOUDS
  util.range(0, (-27 - y) / 16).forEach(i =>
    entities.push(
      new entity.State(
        entity.Type.CLOUD,
        {
          // Round now to prevent rain from being an extra pixel off due to
          // truncation later.
          x: x + Math.round((i + 1) / 2),
          y: y + 6 + i * 16 - Math.max(0, y + 6 + i * 16 - -12)
        },
        animation.ID.RAIN,
        drawOrder,
        {x: 0, y: 0},
        {x: 1, y: 1},
        {x: 0, y: -0.012},
        {x: speed, y: 0}
      )
    )
  )
  entities.push(
    new entity.State(
      entity.Type.CLOUD,
      {x: x + 1, y: -12},
      animation.ID.WATER_M,
      drawOrder,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 0},
      {x: speed, y: 0}
    )
  )
  entities.push(
    new entity.State(
      entity.Type.CLOUD,
      {x, y},
      animationID,
      drawOrder,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 0},
      {
        x: speed,
        y: 0
      }
    )
  )
  return entities
}
