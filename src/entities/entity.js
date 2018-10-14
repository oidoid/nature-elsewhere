import * as atlas from './atlas.js'
import * as player from './player.js'
import * as recorder from '../inputs/recorder.js'
import * as superBall from './superBall.js'

/** @typedef {import('./animation').ID} animation.ID */

/**
 * @typedef {Object} NewState
 * @prop {Mutable<XY>} scrollPosition
 * @prop {Mutable<XY>} scale
 * @prop {XY} scrollSpeed
 * @prop {XY} speed
 * @prop {number} cel
 * @prop {number} celTime Cel exposure in milliseconds.
 */

/**
 * @typedef {Object} _State
 * @prop {Type} type
 * @prop {Mutable<XY>} position
 * @prop {animation.ID} animationID
 * @prop {DrawOrder} drawOrder
 * @typedef {_State & NewState} State
 */

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
 * @arg {{cel: number}} state
 * @arg {atlas.Animation} animation
 * @return {number}
 */
export function cel(state, animation) {
  return Math.abs(state.cel % animation.cels.length)
}

/** @return {NewState} */
export function newState() {
  return {
    scrollPosition: {x: 0, y: 0},
    scale: {x: 1, y: 1},
    scrollSpeed: {x: 0, y: 0},
    speed: {x: 0, y: 0},
    cel: 0,
    celTime: 0
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
  switch (state.type) {
    case Type.PLAYER:
      return player.nextStepState(state, step, atlasState, recorderState)
    case Type.SUPER_BALL:
      return superBall.nextStepState(state, step, atlasState)
  }

  stepAnimation(state, step, atlasState.animations[state.animationID])
  state.position.x += step * state.speed.x
  state.position.y += step * state.speed.y
  state.scrollPosition.x += step * state.scrollSpeed.x
  state.scrollPosition.y += step * state.scrollSpeed.y
}

/**
 * @arg {{cel: number, celTime: number}} state
 * @arg {number} step
 * @arg {atlas.Animation} animation
 * @return {void}
 */
export function stepAnimation(state, step, animation) {
  if (animation.cels.length === 0) return

  const time = state.celTime + step
  const duration = animation.cels[cel(state, animation)].duration
  if (time < duration) {
    state.celTime = time
  } else {
    state.celTime = time - duration
    state.cel = nextCel(state, animation)
  }
}

/**
 * @arg {{cel: number, celTime: number}} state
 * @arg {atlas.Animation} animation
 * @return {number}
 */
export function nextCel(state, animation) {
  const len = animation.cels.length
  switch (animation.direction) {
    case atlas.AnimationDirection.FORWARD:
      return state.cel + 1
    case atlas.AnimationDirection.REVERSE:
      return state.cel - 1 + len
    case atlas.AnimationDirection.PING_PONG:
      return ((state.cel - 1 - (len - 1)) % (2 * (len - 1))) + (len - 1)
  }
  throw new Error(`Unknown AnimationDirection "${animation.direction}".`)
}
