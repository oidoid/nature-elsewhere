import * as animatable from './textures/animatable.js'
import * as recorder from './inputs/recorder.js'
import * as shader from './graphics/shader.js'
import * as util from './util.js'
import {Entity} from './entities/entity.js'
import {AnimationLayer} from './assets/animation-layer.js'

/** @typedef {import('./textures/atlas.js').Atlas} Atlas} */

export class Store {
  constructor() {
    /** @prop {Int16Array} */ this._memory = new Int16Array()
    /** @prop {ReadonlyArray<Entity | EntityGroup>} */ this._entities = /** @type {(animatable.State | Entity)[]} */ ([])
  }

  /** @return {Int16Array} */
  getMemory() {
    return this._memory
  }

  /** @return {number} */
  getLength() {
    return this._entities.reduce(
      (sum, val) =>
        sum + (val instanceof Entity ? val.getAnimatables().length : 1),
      0
    )
  }

  /**
   * @arg {ReadonlyArray<animatable.State | Entity>} entities
   * @return {void}
   */
  spawn(entities) {
    entities.forEach(entity => {
      let index = this._entities.findIndex(
        val =>
          (entity instanceof Entity
            ? entity.getLayer()
            : AnimationLayer[entity.animationID]) <=
          (val instanceof Entity
            ? val.getLayer()
            : AnimationLayer[val.animationID])
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
    this._entities.forEach(entity => {
      if (entity instanceof Entity) {
        entity.step(step, atlas, recorder)
      } else {
        animatable.step(entity, step, atlas.animations[entity.animationID])
      }
    })
  }

  /** @return {void} */
  flushUpdatesToMemory() {
    /** @type {ReadonlyArray<animatable.State>} */ const entities = this._entities
      .map(
        entity => (entity instanceof Entity ? entity.getAnimatables() : entity)
      )
      .reduce(util.flatten, [])
    const minMemory = entities.length * shader.layout.perInstance.length
    if (this._memory.length < minMemory) {
      this._memory = new Int16Array(minMemory * 2)
    }
    entities.forEach((entity, i) => {
      const coord = animatable.bounds(entity)
      // prettier-ignore
      this._memory.set([coord.x, coord.y, coord.w, coord.h,
                        entity.scrollPosition.x, entity.scrollPosition.y,
                        entity.position.x, entity.position.y,
                        entity.scale.x, entity.scale.y],
                        i * shader.layout.perInstance.length)
    })
  }
}
