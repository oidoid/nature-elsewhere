import * as drawable from '../drawables/drawable.js'
import * as entity from './entity.js'
import {AnimationID} from '../drawables/animation-id.js'
import {EntityID} from './entity-id.js'

/** @typedef {import('../drawables/atlas').Atlas} Atlas} */
/** @typedef {import('../inputs/recorder').ReadState} Recorder} */

/**
 * @arg {XY} position
 * @return {entity.State}
 */
export function newState(position) {
  return entity.newState(
    EntityID.POINTER,
    [drawable.newState(AnimationID.PALETTE_BLACK)],
    position
  )
}

/**
 * @arg {entity.State} entity
 * @arg {number} _step
 * @arg {Atlas} _atlas
 * @arg {Recorder} recorder
 * @return {void}
 */
export function step(entity, _step, _atlas, recorder) {
  const xy = recorder.move()
  if (xy) {
    entity.position.x = xy.x
    entity.position.y = xy.y
  }
}
