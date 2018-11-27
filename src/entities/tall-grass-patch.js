import * as drawable from '../drawables/drawable.js'
import * as entity from './entity.js'
import * as random from '../random.js'
import {AnimationID} from '../drawables/animation-id.js'
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

const unitWidth = 5
const unitHeight = 4

/**
 * @arg {XY} position
 * @arg {number} width
 * @arg {random.State} randomState
 * @return {entity.State}
 */
export function newState(position, width, randomState) {
  const drawables = []
  for (let x = 0; x < width; ) {
    let randomWidth = random.int(randomState, unitWidth, 3 * unitWidth + 1)
    if (x + randomWidth > width) randomWidth = width - randomWidth
    drawables.push(
      drawable.newState(
        animationIDs[random.int(randomState, 0, animationIDs.length)],
        {x, y: 0},
        {x: 1, y: 1},
        {x: random.int(randomState, 0, unitWidth), y: 0},
        random.int(randomState, 0, 2),
        0,
        {w: randomWidth, h: unitHeight}
      )
    )
    x += randomWidth
  }
  return entity.newState(EntityID.TALL_GRASS_PATCH, drawables, position)
}
