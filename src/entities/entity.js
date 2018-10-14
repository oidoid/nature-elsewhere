import * as atlas from './atlas.js'
import * as recorder from '../inputs/recorder.js'
import AnimationPlayer from './AnimationPlayer.js'

/** @typedef {import('./animation').ID} animation.ID */

/** @enum {number} */
export const Type = {
  BACKGROUND: 0,
  CLOUD: 1,
  GRASS: 2,
  PLAYER: 3,
  SUPER_BALL: 4,
  TREE: 5,
  WATER: 6
}

/** @enum {number} */
export const DrawOrder = {
  BACKGROUND: 0,
  FAR_BACKGROUND_SCENERY: 1,
  NEAR_BACKGROUND_SCENERY: 2,
  SUPER_BALL: 4,
  PLAYER: 5,
  FOREGROUND_SCENERY: 8,
  CLOUDS: 9,
  FOREGROUND: 10
}

/** @enum {number} */
export const Limits = {
  MIN: 0x8000,
  HALF_MIN: 0xc000,
  MAX: 0x7fff
}

export class State {
  /**
   * @arg {Type} type
   * @arg {XY} position
   * @arg {animation.ID} animationID
   * @arg {DrawOrder} drawOrder
   * @arg {XY} scrollPosition
   * @arg {XY} scale
   * @arg {XY} scrollSpeed
   * @arg {XY} speed
   */
  constructor(
    type,
    position,
    animationID,
    drawOrder,
    scrollPosition = {x: 0, y: 0},
    scale = {x: 1, y: 1},
    scrollSpeed = {x: 0, y: 0},
    speed = {x: 0, y: 0},
    cel = 0,
    celTime = 0
  ) {
    /** @type {Type} */ this._type = type
    /** @type {Mutable<XY>} */ this._position = position
    /** @type {animation.ID} */ this._animationID = animationID
    /** @type {AnimationPlayer} */ this._animationPlayer = new AnimationPlayer()
    /** @type {DrawOrder} */ this._drawOrder = drawOrder
    /** @type {Mutable<XY>} */ this._scrollPosition = scrollPosition
    /** @type {Mutable<XY>} */ this._scale = scale
    /** @type {XY} */ this.scrollSpeed = scrollSpeed
    /** @type {XY} */ this._speed = speed
    /** @type {number} */ this._cel = cel
    /** @type {number} Cel exposure in milliseconds. */ this._celTime = celTime
  }

  /**
   * @arg {number} step
   * @arg {atlas.State} atlasState
   * @arg {recorder.ReadState} _recorderState
   * @return {void}
   */
  nextStepState(step, atlasState, _recorderState) {
    this._animationPlayer.animation = atlasState.animations[this._animationID]
    this._animationPlayer.step(step)
    this._position.x += step * this._speed.x
    this._position.y += step * this._speed.y
    this._scrollPosition.x += step * this.scrollSpeed.x
    this._scrollPosition.y += step * this.scrollSpeed.y
  }

  /** @return {Rect} */
  get bounds() {
    return this._animationPlayer.cel.bounds
  }
}
