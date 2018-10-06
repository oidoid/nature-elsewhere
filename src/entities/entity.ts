import * as animation from './animation'
import * as atlas from './atlas'
import * as player from './player'
import * as recorder from '../inputs/recorder'
import * as superBall from './superBall'

export type NewState = {
  readonly scrollPosition: XY
  readonly scale: XY
  readonly scrollSpeed: XY
  readonly speed: XY
  cel: number
  /** Cel exposure in milliseconds. */
  celTime: number
}

export type State = NewState & {
  readonly type: Type
  readonly position: XY
  animationID: animation.ID
  readonly drawOrder: DrawOrder
}

export enum Type {
  BACKGROUND,
  CLOUD,
  GRASS,
  PLAYER,
  SUPER_BALL,
  TREE,
  WATER
}

export enum DrawOrder {
  BACKGROUND = 0,
  FAR_BACKGROUND_SCENERY = 1,
  NEAR_BACKGROUND_SCENERY = 2,
  SUPER_BALL = 4,
  PLAYER = 5,
  FOREGROUND_SCENERY = 8,
  CLOUDS = 9,
  FOREGROUND = 10
}

export enum Limits {
  MIN = 0x8000,
  HALF_MIN = 0xc000,
  MAX = 0x7fff
}

export function cel(state: {cel: number}, animation: atlas.Animation): number {
  return Math.abs(state.cel % animation.cels.length)
}

export function newState(): NewState {
  return {
    scrollPosition: {x: 0, y: 0},
    scale: {x: 1, y: 1},
    scrollSpeed: {x: 0, y: 0},
    speed: {x: 0, y: 0},
    cel: 0,
    celTime: 0
  }
}

export function nextStepState(
  state: State,
  step: number,
  atlasState: atlas.State,
  recorderState: recorder.State
): void {
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

export function stepAnimation(
  state: {cel: number; celTime: number},
  step: number,
  animation: atlas.Animation
): void {
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

export function nextCel(
  state: {cel: number; celTime: number},
  animation: atlas.Animation
): number {
  const len = animation.cels.length
  switch (animation.direction) {
    case atlas.AnimationDirection.FORWARD:
      return state.cel + 1
    case atlas.AnimationDirection.REVERSE:
      return state.cel - 1 + len
    case atlas.AnimationDirection.PING_PONG:
      return ((state.cel - 1 - (len - 1)) % (2 * (len - 1))) + (len - 1)
  }
}
