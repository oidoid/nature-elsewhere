import * as animatable from '../drawables/animatable.js'
import * as drawable from '../drawables/drawable.js'
import * as entity from './entity.js'
import {AnimationID} from '../assets/animation-id.js'
import {Layer} from '../drawables/layer.js'

/**
 * @arg {XY} position
 * @arg {XY} [speed]
 * @return {entity.State}
 */
export function newState(position, speed = {x: 0, y: 0}) {
  return entity.newState(
    [
      animatable.newState(
        drawable.newState(AnimationID.PALETTE_LIGHT_BLUE_TINT, position)
      )
    ],
    Layer.SUPER_BALL,
    position,
    speed
  )
}
