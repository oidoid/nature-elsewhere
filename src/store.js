import * as animatable from './drawables/animatable.js'
import * as entity from './entities/entity.js'
import * as recorder from './inputs/recorder.js'
import * as shader from './graphics/shader.js'
import {AnimationLayer} from './drawables/animation-layer.js'
import {Behavior} from './entities/behavior.js'
import {EntityLayer} from './entities/entity-layer.js'
import {Layer} from './drawables/layer.js'
import {EntityID} from './entities/entity-id.js'
import {intersects} from './rect.js'

/** @typedef {import('./drawables/atlas').Atlas} Atlas} */
/** @typedef {import('./drawables/drawable').State} Drawable} */
/** @typedef {import('./level').Level} Level */

export class Store {
  constructor() {
    /** @prop {Int16Array} */ this._memory = new Int16Array()
    /** @prop {ReadonlyArray<entity.State|animatable.State|Drawable>} */ this._entities = /** @type {(entity.State|animatable.State|Drawable)[]} */ ([])
  }

  /** @return {Int16Array} */
  getMemory() {
    return this._memory
  }

  /** @return {number} */
  getLength() {
    return this._entities.reduce(
      (sum, val) => sum + (isEntity(val) ? val.animatables.length : 1),
      0
    )
  }

  /**
   * @arg {ReadonlyArray<entity.State|animatable.State|Drawable>} entities
   * @return {void}
   */
  spawn(entities) {
    entities.forEach(lhs => {
      const index = this._entities.findIndex(rhs => layer(lhs) <= layer(rhs))
      this._entities.splice(
        index === -1 ? this._entities.length : index,
        0,
        lhs
      )
    })
  }

  /**
   * @arg {number} milliseconds
   * @arg {Atlas} atlas
   * @arg {recorder.ReadState} recorder
   * @arg {Level} level
   * @arg {Rect} cam
   * @return {ReadonlyArray<entity.State|animatable.State|Drawable>}
   */
  step(milliseconds, atlas, recorder, level, cam) {
    return this._entities.filter(val => {
      if (isEntity(val)) {
        if (val.id !== EntityID.PLAYER) {
          const step = Behavior[val.id] || entity.step
          step(val, milliseconds, atlas, recorder, level, cam, this)
        }
        return onCam(cam, atlas, val.position, ...val.animatables)
      }
      if (isAnimatable(val) && onCam(cam, atlas, {x: 0, y: 0}, val)) {
        animatable.step(val, milliseconds, atlas.animations[val.animationID])
        return true
      }
      return onCam(cam, atlas, {x: 0, y: 0}, val)
    })
  }

  /**
   * @arg {Atlas} atlas
   * @arg {ReadonlyArray<entity.State|animatable.State|Drawable>} entities
   * @return {number}
   */
  flushUpdatesToMemory(atlas, entities) {
    const minMemory = this.getLength() * shader.layout.perInstance.length
    if (this._memory.length < minMemory) {
      this._memory = new Int16Array(minMemory * 2)
    }

    let index = 0
    entities.forEach(val => {
      if (isEntity(val)) {
        val.animatables.forEach((_, i) => {
          const coord = entity.coord(val, i, atlas)
          const scrollPosition = entity.scrollPosition(val, i)
          const position = entity.position(val, i)
          const scale = entity.scale(val, i)
          const palette = entity.palette(val, i)
          const wh = entity.wh(val, i, atlas)
          flush(
            this,
            index,
            coord,
            {...position, ...wh},
            scrollPosition,
            scale,
            palette
          )
          ++index
        })
      } else {
        flush(
          this,
          index,
          {
            ...atlas.animations[val.animationID].cels[val.cel].position,
            ...atlas.animations[val.animationID].size
          },
          {
            ...val.position,
            ...size(atlas, val)
          },
          val.scrollPosition,
          val.scale,
          val.palette
        )
        ++index
      }
    })
    return index
  }
}

/**
 * @arg {Store} state
 * @arg {number} index
 * @arg {Rect} sourceCoord
 * @arg {Rect} targetCoord
 * @arg {XY} scrollPosition
 * @arg {XY} scale
 * @arg {number} palette
 * @return {void}
 */
function flush(
  state,
  index,
  sourceCoord,
  targetCoord,
  scrollPosition,
  scale,
  palette
) {
  // prettier-ignore
  state._memory.set([sourceCoord.x, sourceCoord.y, sourceCoord.w, sourceCoord.h,
                     targetCoord.x, targetCoord.y, targetCoord.w, targetCoord.h,
                     scrollPosition.x, scrollPosition.y,
                     scale.x, scale.y,
                     palette],
                     index * shader.layout.perInstance.length)
}

/**
 * @arg {entity.State|Drawable} val
 * @return {Layer}
 */
function layer(val) {
  return isEntity(val) ? EntityLayer[val.id] : AnimationLayer[val.animationID]
}

/**
 * @arg {entity.State|animatable.State|Drawable} val
 * @return {val is entity.State}
 */
function isEntity(val) {
  return 'animatables' in val
}

/**
 * @arg {entity.State|animatable.State|Drawable} val
 * @return {val is animatable.State}
 */
function isAnimatable(val) {
  return 'animator' in val
}

/**
 * @arg {Rect} cam
 * @arg {Atlas} atlas
 * @arg {XY} position
 * @arg {...Drawable} drawables
 * @return {boolean}
 */
function onCam(cam, atlas, position, ...drawables) {
  return drawables.some(drawable =>
    intersects(rect(atlas, position, drawable), cam)
  )
}

/**
 * @arg {Atlas} atlas
 * @arg {XY} position
 * @arg {Drawable} drawable
 * @return {Rect}
 */
function rect(atlas, position, drawable) {
  const {w, h} = size(atlas, drawable)
  return {
    x: position.x + drawable.position.x,
    y: position.y + drawable.position.y,
    w: Math.abs(drawable.scale.x * w),
    h: Math.abs(drawable.scale.y * h)
  }
}

/**
 * @arg {Atlas} atlas
 * @arg {Drawable} drawable
 * @return {WH}
 */
function size(atlas, drawable) {
  return drawable.size
    ? drawable.size
    : atlas.animations[drawable.animationID].size
}
