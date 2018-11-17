import * as animatable from '../drawables/animatable.js'
import * as drawable from '../drawables/drawable.js'
import * as entity from './entity.js'
import * as util from '../util.js'
import {AnimationID} from '../drawables/animation-id.js'
import {EntityID} from './entity-id.js'

/** @typedef {import('../drawables/atlas').Atlas} Atlas} */
/** @typedef {import('../level').Level} Level */
/** @typedef {import('../inputs/recorder').ReadState} Recorder} */
/** @typedef {import('../store').Store} Store} */

/**
 * A group of Animatables with a behavior and relative position and speed.
 * @typedef {{
 *   index: number
 * } & entity.State} State
 */

/**
 * @arg {XY} position
 * @return {State}
 */
export function newState(position) {
  return {
    ...entity.newState(
      EntityID.POINTER,
      [drawable.newState(AnimationID.PALETTE_BLACK)],
      position
    ),
    index: 0
  }
}

/**
 * @arg {entity.State|State} entity
 * @arg {number} _step
 * @arg {Atlas} _atlas
 * @arg {Recorder} recorder
 * @arg {Level} _level
 * @arg {WH} _cam
 * @arg {Store} store
 * @return {void}
 */
export function step(entity, _step, _atlas, recorder, _level, _cam, store) {
  if (!('index' in entity)) return
  {
    const xy = recorder.move()
    if (xy) {
      entity.position.x = xy.x
      entity.position.y = xy.y
    }
  }

  {
    const xy = recorder.pick(true)
    if (xy) {
      store.spawn([
        drawable.newState(entity.animatables[0].animationID, {
          ...entity.position
        })
      ])
    }
  }

  const anis = util.values(AnimationID)
  entity.index = util.clamp(
    entity.index -
      (recorder.prevEntity(true) ? 1 : 0) +
      (recorder.nextEntity(true) ? 1 : 0),
    0,
    anis.length - 1
  )

  entity.animatables[0] = animatable.newState(
    drawable.newState(anis[entity.index])
  )
}
