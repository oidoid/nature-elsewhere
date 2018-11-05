import * as animatable from '../drawables/animatable.js'
import * as drawable from '../drawables/drawable.js'
import * as entity from './entity.js'
import * as util from '../util.js'
import {AnimationID} from '../drawables/animation-id.js'
import {EntityID} from './entity-id.js'

const ground = 96

/**
 * @arg {AnimationID} animationID
 * @arg {XY} position
 * @arg {number} [speed]
 * @return {entity.State}
 */
export function newState(animationID, position, speed = 0) {
  /** @type {animatable.State[]} */ const animatables = []
  util.range(0, Math.ceil((ground - position.y) / 16)).forEach(i =>
    animatables.push(
      animatable.newState(
        drawable.newState(AnimationID.RAIN, {
          // Round now to prevent rain from being an extra pixel off due to
          // truncation later.
          x: Math.trunc((-i + 2) / 2),
          y: Math.min(ground - position.y - 16, 6 + i * 16)
        }),
        {x: 0, y: -0.012}
      )
    )
  )

  animatables.push(
    animatable.newState(
      drawable.newState(AnimationID.WATER_M, {
        x: 1,
        y: ground - position.y - 1
      })
    )
  )
  animatables.push(animatable.newState(drawable.newState(animationID)))

  return entity.newState(EntityID.RAIN_CLOUD, animatables, position, {
    x: speed,
    y: 0
  })
}
