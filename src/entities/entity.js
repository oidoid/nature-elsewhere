import * as recorder from '../inputs/recorder.js'
import {Animation} from '../textures/animation.js'
import {DrawOrder} from '../textures/draw-order.js'

/** @typedef {import('../textures/atlas.js').Atlas} Atlas} */

export class Entity {
  /** @arg {ReadonlyArray<Animation>} entities */
  constructor(entities) {
    /** @type {ReadonlyArray<Animation>} */ this._entities = entities
  }

  /** @return {ReadonlyArray<Animation>} */
  get entities() {
    return this._entities
  }

  /** @return {DrawOrder} */
  get drawOrder() {
    return DrawOrder.DEFAULT
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
