import * as animatable from '../drawables/animatable.js'
import * as drawable from '../drawables/drawable.js'
import * as entity from './entity.js'
import {AnimationID} from '../drawables/animation-id.js'
import {EntityID} from './entity-id.js'

/**
 * @arg {XY} position
 * @arg {XY} [speed]
 * @return {entity.State}
 */
export function newState(position, speed = {x: 0, y: 0}) {
  return entity.newState(
    EntityID.SUPER_BALL,
    [
      animatable.newState(
        drawable.newState(AnimationID.PALETTE_LIGHT_BLUE_TINT, position)
      )
    ],
    position,
    speed
  )
}
