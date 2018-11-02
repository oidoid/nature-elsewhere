import * as player from './player.js'
import {AnimationID} from '../assets/animation-id.js'
import {EntityID} from './entity-id.js'

/** @typedef {import('../drawables/atlas').Atlas} Atlas} */
/** @typedef {import('./entity').State} Entity} */
/** @typedef {import('../inputs/recorder').ReadState} Recorder} */

/**
 * @typedef {(entity: Entity, step: number, atlas: Atlas, recorder: Recorder) => void} Step
 */

/** @type {Readonly<Partial<Record<AnimationID | EntityID, Step>>>} */
export const Behavior = {
  [EntityID.PLAYER]: player.step
}
