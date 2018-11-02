import * as animatable from '../drawables/animatable.js'
import * as drawable from '../drawables/drawable.js'
import * as entity from './entity.js'
import * as random from '../random.js'
import * as util from '../util.js'
import {AnimationID} from '../assets/animation-id.js'
import {EntityID} from './entity-id.js'

const animationIDs = [
  AnimationID.TALL_GRASS_A,
  AnimationID.TALL_GRASS_B,
  AnimationID.TALL_GRASS_C,
  AnimationID.TALL_GRASS_D,
  AnimationID.TALL_GRASS_E,
  AnimationID.TALL_GRASS_F,
  AnimationID.TALL_GRASS_G,
  AnimationID.TALL_GRASS_H,
  AnimationID.TALL_GRASS_I
]

const unitWidth = 4

/**
 * @arg {XY} position
 * @arg {number} width
 * @arg {random.State} randomState
 * @return {entity.State}
 */
export function newState(position, width, randomState) {
  const animatables = util
    .range(0, Math.floor(width / unitWidth))
    .map(i =>
      animatable.newState(
        drawable.newState(
          animationIDs[random.int(randomState, 0, animationIDs.length)],
          {x: i * 4, y: 0}
        )
      )
    )
  return entity.newState(EntityID.TALL_GRASS_PATCH, animatables, position)
}
