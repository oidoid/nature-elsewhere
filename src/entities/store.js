import * as recorder from '../inputs/recorder.js'
import * as shader from '../graphics/shader.js'
import {Entity} from './entity.js'

/** @typedef {import('../textures/atlas.js').Atlas} Atlas} */

export class Store {
  constructor() {
    /** @prop {Int16Array} */ this._memory = new Int16Array()
    /** @prop {ReadonlyArray<Entity>} */ this._entities = /** @type {Entity[]} */ ([])
  }

  /**
   * @arg {ReadonlyArray<Entity>} entities
   * @return {void}
   */
  spawn(entities) {
    entities.forEach(entity => {
      let index = this._entities.findIndex(
        val => entity.drawOrder <= val.drawOrder
      )
      this._entities.splice(
        index === -1 ? this._entities.length : index,
        0,
        entity
      )
    })
  }

  /**
   * @arg {number} step
   * @arg {Atlas} atlas
   * @arg {recorder.ReadState} recorderState
   * @return {void}
   */
  step(step, atlas, recorderState) {
    this._entities.forEach(entity => entity.step(step, atlas, recorderState))
  }

  /** @return {void} */
  flushUpdatesToMemory() {
    const length = this._entities.length
    if (this._memory.length < length * shader.layout.perInstance.length) {
      this._memory = new Int16Array(
        length * shader.layout.perInstance.length * 2
      )
    }
    this._entities.forEach((entity, i) => {
      const coord = entity.bounds
      // prettier-ignore
      this._memory.set([coord.x, coord.y, coord.w, coord.h,
                        entity._scrollPosition.x, entity._scrollPosition.y,
                        entity._position.x, entity._position.y,
                        entity._scale.x, entity._scale.y],
                        i * shader.layout.perInstance.length)
    })
  }
}
