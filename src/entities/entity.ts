import * as atlas from '../assets/atlas'
import * as player from './player'
import * as recorder from '../inputs/recorder'
import * as superBall from './superBall'
import * as texture from '../assets/texture'
import * as util from '../util'

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

export type NewState = {
  readonly scrollPosition: XY
  readonly scale: XY
  readonly scrollSpeed: XY
  readonly speed: XY
}

export type State = NewState & {
  readonly type: Type
  readonly coord: Rect
  readonly position: XY
  textureID: texture.ID
  readonly drawOrder: DrawOrder
}

export function newState(): NewState {
  return {
    scrollPosition: {x: 0, y: 0},
    scale: {x: 1, y: 1},
    scrollSpeed: {x: 0, y: 0},
    speed: {x: 0, y: 0}
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

export function newCloud(
  atlas: atlas.State,
  textureID: texture.ID,
  position: XY
): State[] {
  const coord = atlas.animations[textureID].cels[0].bounds
  return [
    {
      ...newState(),
      type: Type.CLOUD,
      coord,
      position,
      textureID,
      drawOrder: DrawOrder.CLOUDS
    }
  ]
}

export function newBackground(
  atlas: atlas.State,
  position: XY,
  scale: XY
): State[] {
  const textureID = texture.ID.PALETTE_PALE
  const coord = atlas.animations[textureID].cels[0].bounds
  const drawOrder = DrawOrder.BACKGROUND
  return [
    {
      ...newState(),
      type: Type.BACKGROUND,
      coord,
      position,
      scale,
      textureID,
      drawOrder
    }
  ]
}

export function newPlayer(atlas: atlas.State, position: XY): State[] {
  const textureID = texture.ID.PLAYER_IDLE
  const coord = atlas.animations[textureID].cels[0].bounds
  const drawOrder = DrawOrder.PLAYER
  return [
    {...newState(), type: Type.PLAYER, coord, position, textureID, drawOrder}
  ]
}

export function newRainCloud(
  atlas: atlas.State,
  textureID: texture.ID,
  {x, y}: XY,
  speed: number
): State[] {
  const entities: State[] = []
  const drawOrder = DrawOrder.CLOUDS
  util.range(0, (-27 - y) / 16).forEach(i =>
    entities.push({
      ...newState(),
      type: Type.CLOUD,
      coord: atlas.animations[texture.ID.RAIN].cels[0].bounds,
      position: {
        // Round now to prevent rain from being an extra pixel off due to
        // truncation later.
        x: x + Math.round((i + 1) / 2),
        y: y + 6 + i * 16 - Math.max(0, y + 6 + i * 16 - -12)
      },
      textureID: texture.ID.RAIN,
      drawOrder,
      speed: {x: speed, y: 0},
      scrollSpeed: {x: 0, y: -12}
    })
  )
  entities.push({
    ...newState(),
    type: Type.CLOUD,
    coord: atlas.animations[texture.ID.WATER_M].cels[0].bounds,
    position: {x: x + 1, y: -12},
    textureID: texture.ID.WATER_M,
    drawOrder,
    speed: {x: speed, y: 0}
  })
  entities.push({
    ...newState(),
    type: Type.CLOUD,
    coord: atlas.animations[textureID].cels[0].bounds,
    position: {x, y},
    textureID,
    drawOrder,
    speed: {x: speed, y: 0}
  })
  return entities
}

export function newGrass(
  atlas: atlas.State,
  textureID: texture.ID,
  position: XY,
  scale: XY = {x: 1, y: 1}
): State[] {
  const coord = atlas.animations[textureID].cels[0].bounds
  const drawOrder = [
    texture.ID.GRASS_XS,
    texture.ID.GRASS_S,
    texture.ID.GRASS_M,
    texture.ID.GRASS_L
  ].includes(textureID)
    ? DrawOrder.FAR_BACKGROUND_SCENERY
    : DrawOrder.FOREGROUND_SCENERY
  return [
    {
      ...newState(),
      type: Type.GRASS,
      coord,
      position,
      scale,
      textureID,
      drawOrder
    }
  ]
}

export function newTree(atlas: atlas.State, position: XY): State[] {
  const textureID = texture.ID.TREE
  const coord = atlas.animations[textureID].cels[0].bounds
  const drawOrder = DrawOrder.NEAR_BACKGROUND_SCENERY
  return [
    {...newState(), type: Type.TREE, coord, position, textureID, drawOrder}
  ]
}

export function newSuperBall(
  atlas: atlas.State,
  position: XY,
  speed: XY
): State[] {
  const textureID = texture.ID.PALETTE_GOLD
  const coord = atlas.animations[textureID].cels[0].bounds
  return [
    {
      ...newState(),
      speed,
      type: Type.SUPER_BALL,
      coord,
      position,
      textureID,
      drawOrder: DrawOrder.SUPER_BALL
    }
  ]
}
