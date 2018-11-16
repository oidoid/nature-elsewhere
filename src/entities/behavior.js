import * as entity from './entity.js'
import * as player from './player.js'
import * as pointer from './pointer.js'
import * as util from '../util.js'
import {EntityID} from './entity-id.js'

/** @typedef {import('../drawables/atlas').Atlas} Atlas} */
/** @typedef {import('./entity').State} Entity} */
/** @typedef {import('../level').Level} Level */
/** @typedef {import('../inputs/recorder').ReadState} Recorder} */

/**
 * @typedef {(entity: Entity, step: number, atlas: Atlas, recorder: Recorder, level: Level, cam: WH) => void} Step
 */

/** @type {Readonly<Partial<Record<EntityID, Step>>>} */
export const Behavior = {
  [EntityID.CLOUD]: wraparound,
  [EntityID.PLAYER]: player.step,
  [EntityID.POINTER]: pointer.step,
  [EntityID.RAIN_CLOUD]: wraparound,
  [EntityID.TALL_GRASS_PATCH]: () => {}
}

/** @type {Step} */
export function wraparound(entityState, step, atlas, _recorder, level, cam) {
  entity.step(entityState, step, atlas)
  const min = level.bounds.x - cam.w
  const max = level.bounds.x + level.bounds.w + cam.w
  entityState.position.x = util.wrap(entityState.position.x, min, max)
}
