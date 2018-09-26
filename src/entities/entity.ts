import * as atlas from '../assets/atlas'
import * as player from './player'
import * as recorder from '../inputs/recorder'
import * as superBall from './superBall'
import * as animation from '../assets/animation'
import * as util from '../util'

export type NewState = {
  readonly scrollPosition: XY
  readonly scale: XY
  readonly scrollSpeed: XY
  readonly speed: XY
  cel: number
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

export function newState(): NewState {
  return {
    scrollPosition: {x: 0, y: 0},
    scale: {x: 1, y: 1},
    scrollSpeed: {x: 0, y: 0},
    speed: {x: 0, y: 0},
    cel: 0
  }
}

export function nextStepState(
  state: State,
  step: number,
  atlas: atlas.State,
  recorderState: recorder.State
): void {
  switch (state.type) {
    case Type.PLAYER:
      return player.nextStepState(state, step, atlas, recorderState)
    case Type.SUPER_BALL:
      return superBall.nextStepState(state, step, atlas)
  }
  state.position.x += step * state.speed.x
  state.position.y += step * state.speed.y
  state.scrollPosition.x += step * state.scrollSpeed.x
  state.scrollPosition.y += step * state.scrollSpeed.y
}

export function newCloud(animationID: animation.ID, position: XY): State[] {
  return [
    {
      ...newState(),
      type: Type.CLOUD,
      position,
      animationID,
      drawOrder: DrawOrder.CLOUDS
    }
  ]
}

export function newBackground(position: XY, scale: XY): State[] {
  const animationID = animation.ID.PALETTE_PALE
  const drawOrder = DrawOrder.BACKGROUND
  return [
    {
      ...newState(),
      type: Type.BACKGROUND,
      position,
      scale,
      animationID,
      drawOrder
    }
  ]
}

export function newPlayer(position: XY): State[] {
  const animationID = animation.ID.PLAYER_IDLE
  const drawOrder = DrawOrder.PLAYER
  return [{...newState(), type: Type.PLAYER, position, animationID, drawOrder}]
}

export function newRainCloud(
  animationID: animation.ID,
  {x, y}: XY,
  speed: number
): State[] {
  const entities: State[] = []
  const drawOrder = DrawOrder.CLOUDS
  util.range(0, (-27 - y) / 16).forEach(i =>
    entities.push({
      ...newState(),
      type: Type.CLOUD,
      position: {
        // Round now to prevent rain from being an extra pixel off due to
        // truncation later.
        x: x + Math.round((i + 1) / 2),
        y: y + 6 + i * 16 - Math.max(0, y + 6 + i * 16 - -12)
      },
      animationID: animation.ID.RAIN,
      drawOrder,
      speed: {x: speed, y: 0},
      scrollSpeed: {x: 0, y: -12}
    })
  )
  entities.push({
    ...newState(),
    type: Type.CLOUD,
    position: {x: x + 1, y: -12},
    animationID: animation.ID.WATER_M,
    drawOrder,
    speed: {x: speed, y: 0}
  })
  entities.push({
    ...newState(),
    type: Type.CLOUD,
    position: {x, y},
    animationID,
    drawOrder,
    speed: {x: speed, y: 0}
  })
  return entities
}

export function newGrass(
  animationID: animation.ID,
  position: XY,
  scale: XY = {x: 1, y: 1}
): State[] {
  const drawOrder = [
    animation.ID.GRASS_XS,
    animation.ID.GRASS_S,
    animation.ID.GRASS_M,
    animation.ID.GRASS_L
  ].includes(animationID)
    ? DrawOrder.FAR_BACKGROUND_SCENERY
    : DrawOrder.FOREGROUND_SCENERY
  return [
    {
      ...newState(),
      type: Type.GRASS,
      position,
      scale,
      animationID,
      drawOrder
    }
  ]
}

export function newTree(position: XY): State[] {
  const animationID = animation.ID.TREE
  const drawOrder = DrawOrder.NEAR_BACKGROUND_SCENERY
  return [{...newState(), type: Type.TREE, position, animationID, drawOrder}]
}

export function newSuperBall(position: XY, speed: XY): State[] {
  const animationID = animation.ID.PALETTE_GOLD
  return [
    {
      ...newState(),
      speed,
      type: Type.SUPER_BALL,
      position,
      animationID,
      drawOrder: DrawOrder.SUPER_BALL
    }
  ]
}
