import * as entity from './entity.js'
import * as recorder from '../inputs/recorder.js'
import {DrawOrder} from './draw-order.js'

/** @typedef {import('../textures/atlas.js').Atlas} Atlas} */

export class EntityGroup {
  /** @arg {ReadonlyArray<entity.Entity>} entities */
  constructor(entities) {
    /** @type {ReadonlyArray<entity.Entity>} */ this._entities = entities
  }

  /** @return {ReadonlyArray<entity.Entity>} */
  get entities() {
    return this._entities
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return this._entities.reduce(
      (drawOrder, entity) => Math.max(drawOrder, entity.drawOrder),
      DrawOrder.DEFAULT
    )
  }

  /**
   * @arg {number} step
   * @arg {Atlas} atlas
   * @arg {recorder.ReadState} recorder
   * @return {void}
   */
  step(step, atlas, recorder) {
    this._entities.forEach(entity => entity.step(step, atlas, recorder))
  }
}
