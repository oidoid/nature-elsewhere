import * as atlas from './atlas.js'
import * as player from './player.js'
import * as recorder from '../inputs/recorder.js'
import * as superBall from './superBall.js'

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

/**
 * @type {Readonly<
 *   Record<atlas.AnimationDirection, (cel: number, length: number) => number>
 * >}
 */
const AnimationDirectionStep = {
  [atlas.AnimationDirection.FORWARD](cel) {
    return cel + 1
  },
  [atlas.AnimationDirection.REVERSE](cel, length) {
    return cel - 1 + length
  },
  [atlas.AnimationDirection.PING_PONG](cel, length) {
    return ((cel - 1 - (length - 1)) % (2 * (length - 1))) + (length - 1)
  }
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
   * @arg {number} cel
   * @arg {number} celTime
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
    /** @type {DrawOrder} */ this._drawOrder = drawOrder
    /** @type {Mutable<XY>} */ this._scrollPosition = scrollPosition
    /** @type {Mutable<XY>} */ this._scale = scale
    /** @type {XY} */ this.scrollSpeed = scrollSpeed
    /** @type {XY} */ this._speed = speed
    /** @type {number} */ this._cel = cel
    /** @type {number} Cel exposure in milliseconds. */ this._celTime = celTime
  }

  /**
   * @arg {atlas.Animation} animation
   * @return {number}
   */
  cel(animation) {
    return Math.abs(this._cel % animation.cels.length)
  }

  /**
   * @arg {number} step
   * @arg {atlas.Animation} animation
   * @return {void}
   */
  stepAnimation(step, animation) {
    if (animation.cels.length === 0) return

    const time = this._celTime + step
    const duration = animation.cels[this.cel(animation)].duration
    if (time < duration) {
      this._celTime = time
    } else {
      this._celTime = time - duration
      this._cel = this.nextCel(animation)
    }
  }

  /**
   * @arg {atlas.Animation} animation
   * @return {number}
   */
  nextCel(animation) {
    const fnc = AnimationDirectionStep[animation.direction]
    if (!fnc) {
      throw new Error(`Unknown AnimationDirection "${animation.direction}".`)
    }
    return fnc(this._cel, animation.cels.length)
  }
}

/**
 * @arg {State} state
 * @arg {number} step
 * @arg {atlas.State} atlasState
 * @arg {recorder.ReadState} recorderState
 * @return {void}
 */
export function nextStepState(state, step, atlasState, recorderState) {
  switch (state._type) {
    case Type.PLAYER:
      return player.nextStepState(state, step, atlasState, recorderState)
    case Type.SUPER_BALL:
      return superBall.nextStepState(state, step, atlasState)
  }

  state.stepAnimation(step, atlasState.animations[state._animationID])
  state._position.x += step * state._speed.x
  state._position.y += step * state._speed.y
  state._scrollPosition.x += step * state.scrollSpeed.x
  state._scrollPosition.y += step * state.scrollSpeed.y
}
