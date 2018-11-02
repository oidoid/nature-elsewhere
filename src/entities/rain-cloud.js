import * as animatable from '../drawables/animatable.js'
import * as drawable from '../drawables/drawable.js'
import * as entity from './entity.js'
import * as util from '../util.js'
import {AnimationID} from '../drawables/animation-id.js'
import {EntityID} from './entity-id.js'

/**
 * @arg {AnimationID} animationID
 * @arg {XY} position
 * @arg {number} [speed]
 * @return {entity.State}
 */
export function newState(animationID, position, speed = 0) {
  /** @type {animatable.State[]} */ const animatables = []
  util.range(0, (position.y + 27) / 16).forEach(i =>
    animatables.push(
      animatable.newState(
        drawable.newState(AnimationID.RAIN, {
          // Round now to prevent rain from being an extra pixel off due to
          // truncation later.
          x: Math.round((-i + 2) / 2),
          y: 6 - i * 16
        }),
        {x: 0, y: -0.012}
      )
    )
  )

  animatables.push(
    animatable.newState(
      drawable.newState(AnimationID.WATER_M, {x: 1, y: -position.y - 12})
    )
  )
  animatables.push(animatable.newState(drawable.newState(animationID)))

  return entity.newState(EntityID.RAIN_CLOUD, animatables, position, {
    x: speed,
    y: 0
  })
}
