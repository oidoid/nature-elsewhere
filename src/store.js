import * as recorder from './inputs/recorder.js'
import * as shader from './graphics/shader.js'
import * as util from './util.js'
import {Entity} from './entities/entity.js'
import {EntityGroup} from './entities/entity-group.js'

/** @typedef {import('./textures/atlas.js').Atlas} Atlas} */

export class Store {
  constructor() {
    /** @prop {Int16Array} */ this._memory = new Int16Array()
    /** @prop {ReadonlyArray<Entity | EntityGroup>} */ this._entities = /** @type {(Entity | EntityGroup)[]} */ ([])
  }

  /** @return {Int16Array} */
  get memory() {
    return this._memory
  }

  /** @return {number} */
  get length() {
    return this._entities.reduce(
      (sum, val) =>
        sum + (val instanceof EntityGroup ? val.entities.length : 1),
      0
    )
  }

  /**
   * @arg {ReadonlyArray<Entity | EntityGroup>} entities
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
   * @arg {recorder.ReadState} recorder
   * @return {void}
   */
  step(step, atlas, recorder) {
    this._entities.forEach(entity => entity.step(step, atlas, recorder))
  }

  /** @return {void} */
  flushUpdatesToMemory() {
    /** @type {ReadonlyArray<Entity>} */ const entities = this._entities
      .map(entity => (entity instanceof EntityGroup ? entity.entities : entity))
      .reduce(util.flatten, [])
    const minMemory = entities.length * shader.layout.perInstance.length
    if (this._memory.length < minMemory) {
      this._memory = new Int16Array(minMemory * 2)
    }
    entities.forEach((entity, i) => {
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
