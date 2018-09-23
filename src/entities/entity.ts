import * as atlas from '../assets/atlas'
import * as player from './player'
import * as recorder from '../inputs/recorder'
import * as texture from '../assets/texture'
import * as util from '../util'

export enum DrawOrder {
  BACKGROUND = 0,
  BACKGROUND_SCENERY = 1,
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

export type State = {
  readonly coord: Rect
  readonly scrollPosition: XY
  readonly position: XY
  readonly scale: XY
  textureID: texture.ID
  readonly drawOrder: DrawOrder
  readonly scrollSpeed: XY
  readonly speed: XY
}

function newState() {
  return {
    scrollPosition: {x: 0, y: 0},
    scale: {x: 1, y: 1},
    speed: {x: 0, y: 0},
    scrollSpeed: {x: 0, y: 0}
  }
}

export function nextStepState(
  state: State,
  step: number,
  atlas: atlas.State,
  recorderState: recorder.State
): void {
  switch (state.textureID) {
    case texture.ID.PLAYER_IDLE:
    case texture.ID.PLAYER_IDLE_ARMED:
    case texture.ID.PLAYER_CROUCH:
    case texture.ID.PLAYER_CROUCH_ARMED:
    case texture.ID.PLAYER_WALK:
    case texture.ID.PLAYER_WALK_ARMED:
    case texture.ID.PLAYER_RUN:
    case texture.ID.PLAYER_RUN_ARMED:
    case texture.ID.PLAYER_ASCEND:
    case texture.ID.PLAYER_ASCEND_ARMED:
    case texture.ID.PLAYER_DESCEND:
    case texture.ID.PLAYER_DESCEND_ARMED:
    case texture.ID.PLAYER_SIT:
      return player.nextStepState(state, step, atlas, recorderState)
  }
  state.position.x += step * state.speed.x
  state.position.y + step * state.speed.y
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
    {...newState(), coord, position, textureID, drawOrder: DrawOrder.CLOUDS}
  ]
}

export function newPalette3(
  atlas: atlas.State,
  position: XY,
  scale: XY
): State[] {
  const textureID = texture.ID.PALETTE_3
  const coord = atlas.animations[textureID].cels[0].bounds
  const drawOrder = DrawOrder.BACKGROUND
  return [{...newState(), coord, position, scale, textureID, drawOrder}]
}

export function newPlayer(atlas: atlas.State, position: XY): State[] {
  const textureID = texture.ID.PLAYER_IDLE
  const coord = atlas.animations[textureID].cels[0].bounds
  const drawOrder = DrawOrder.PLAYER
  return [{...newState(), coord, position, textureID, drawOrder}]
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
    coord: atlas.animations[texture.ID.WATER_M].cels[0].bounds,
    position: {x: x + 1, y: -12},
    textureID: texture.ID.WATER_M,
    drawOrder,
    speed: {x: speed, y: 0}
  })
  entities.push({
    ...newState(),
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
  const drawOrder = DrawOrder.FOREGROUND_SCENERY
  return [{...newState(), coord, position, scale, textureID, drawOrder}]
}

export function newTree(atlas: atlas.State, position: XY): State[] {
  const textureID = texture.ID.TREE
  const coord = atlas.animations[textureID].cels[0].bounds
  const drawOrder = DrawOrder.BACKGROUND_SCENERY
  return [{...newState(), coord, position, textureID, drawOrder}]
}
