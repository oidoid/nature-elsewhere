import * as entity from './entities/entity.js'
import * as recorder from './inputs/recorder.js'
import * as shader from './graphics/shader.js'
import {Behavior} from './entities/behavior.js'
import {EntityLayer} from './entities/entity-layer.js'

/** @typedef {import('./drawables/atlas.js').Atlas} Atlas} */

export class Store {
  constructor() {
    /** @prop {Int16Array} */ this._memory = new Int16Array()
    /** @prop {ReadonlyArray<entity.State>} */ this._entities = /** @type {entity.State[]} */ ([])
  }

  /** @return {Int16Array} */
  getMemory() {
    return this._memory
  }

  /** @return {number} */
  getLength() {
    return this._entities.reduce((sum, val) => sum + val.animatables.length, 0)
  }

  /**
   * @arg {ReadonlyArray<entity.State>} entities
   * @return {void}
   */
  spawn(entities) {
    entities.forEach(lhs => {
      let index = this._entities.findIndex(
        rhs => EntityLayer[lhs.id] <= EntityLayer[rhs.id]
      )
      this._entities.splice(
        index === -1 ? this._entities.length : index,
        0,
        lhs
      )
    })
  }

  /**
   * @arg {number} stepState
   * @arg {Atlas} atlas
   * @arg {recorder.ReadState} recorder
   * @return {void}
   */
  step(stepState, atlas, recorder) {
    this._entities.forEach(val => {
      const step = Behavior[val.id] || entity.step
      step(val, stepState, atlas, recorder)
    })
  }

  /**
   * @arg {Atlas} atlas
   * @return {void}
   */
  flushUpdatesToMemory(atlas) {
    const minMemory = this.getLength() * shader.layout.perInstance.length
    if (this._memory.length < minMemory) {
      this._memory = new Int16Array(minMemory * 2)
    }
    let index = 0

    this._entities.forEach(val => {
      val.animatables.forEach((_, i) => {
        const coord = entity.coord(val, i, atlas)
        const scrollPosition = entity.scrollPosition(val, i)
        const position = entity.position(val, i)
        const scale = entity.scale(val, i)
        // prettier-ignore
        this._memory.set([coord.x, coord.y, coord.w, coord.h,
                        scrollPosition.x, scrollPosition.y,
                        position.x, position.y,
                        scale.x, scale.y],
                        index * shader.layout.perInstance.length)
        ++index
      })
    })
  }
}
