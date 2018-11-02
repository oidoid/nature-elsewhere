import * as animatable from '../textures/animatable.js'
import * as drawable from '../textures/drawable.js'
import * as entity from './entity.js'
import {AnimationID} from '../assets/animation-id.js'
import {Layer} from '../textures/layer.js'

/**
 * @arg {AnimationID} animationID
 * @arg {XY} position
 * @arg {XY} [speed]
 * @return {entity.State}
 */
export function newState(animationID, position, speed = {x: 0, y: 0}) {
  return entity.newState(
    [animatable.newState(drawable.newState(animationID))],
    Layer.CLOUDS,
    position,
    speed
  )
}
