import {TEXTURE, CloudTextureKey} from '../textures/texture'
import {XY, XYZ} from '../../types/geo'
import {Sprite, SpriteType, DrawOrder} from './sprite'

const BOTTOM_Y = 60

function defaults() {
  return {
    invalidated: true,
    type: SpriteType.OTHER,
    speed: {x: 0, y: 0},
    celIndex: 0,
    scale: {x: 1, y: 1},
    scroll: {x: 0, y: 0},
    scrollPosition: {x: 0, y: 0}
  }
}

export function newCloudS({x, y}: XY): Sprite[] {
  const z = DrawOrder.CLOUDS
  return [{...defaults(), texture: TEXTURE.CLOUD_S, position: {x, y, z}}]
}

export function newCloudM({x, y}: XY): Sprite[] {
  const z = DrawOrder.CLOUDS
  return [{...defaults(), texture: TEXTURE.CLOUD_M, position: {x, y, z}}]
}

export function newCloudL({x, y}: XY): Sprite[] {
  const z = DrawOrder.CLOUDS
  return [{...defaults(), texture: TEXTURE.CLOUD_L, position: {x, y, z}}]
}

export function newCloudXL({x, y}: XY): Sprite[] {
  const z = DrawOrder.CLOUDS
  return [{...defaults(), texture: TEXTURE.CLOUD_XL, position: {x, y, z}}]
}

export function newGrassL({x, y}: XY, scale: XY): Sprite[] {
  const z = DrawOrder.BACKGROUND_SCENERY
  return [{...defaults(), texture: TEXTURE.GRASS_L, position: {x, y, z}, scale}]
}

export function newPalette3(position: XYZ, scale: XY): Sprite[] {
  return [
    {
      ...defaults(),
      texture: TEXTURE.PALETTE_3,
      position,
      scale
    }
  ]
}

export function newPlayer({x, y}: XY): Sprite[] {
  return [
    {
      ...defaults(),
      type: SpriteType.PLAYER,
      texture: TEXTURE.PLAYER_IDLE,
      position: {x, y, z: DrawOrder.PLAYER}
    }
  ]
}

export function newPond({x, y}: XY, flowRate: number): Sprite[] {
  const position = {x, y, z: DrawOrder.BACKGROUND_SCENERY}
  return [
    {...defaults(), texture: TEXTURE.POND_WATER, position},
    {
      ...defaults(),
      texture: TEXTURE.POND_REFLECTIONS,
      position,
      scroll: {x: flowRate, y: 0}
    },
    {...defaults(), texture: TEXTURE.POND_MASK, position}
  ]
}

export function newQuicksand({x, y}: XY, flowRate: number): Sprite[] {
  return [
    {
      ...defaults(),
      texture: TEXTURE.QUICKSAND,
      position: {x, y, z: DrawOrder.FOREGROUND},
      scroll: {x: flowRate, y: 0}
    }
  ]
}

export function newRainCloud(
  cloud: CloudTextureKey,
  {x, y}: XY,
  speed: number
): Sprite[] {
  const sprites: Sprite[] = []
  const z = DrawOrder.CLOUDS
  for (let i = 0; i < (64 - y) / 16; ++i) {
    sprites.push({
      ...defaults(),
      texture: TEXTURE.RAIN,
      position: {
        x: x + Math.round((i + 1) / 2),
        y: y + 6 + i * 16 - Math.max(0, y + 6 + i * 16 - BOTTOM_Y),
        z
      },
      speed: {x: speed, y: 0},
      scroll: {x: 0, y: -12}
    })
  }
  sprites.push({
    ...defaults(),
    texture: TEXTURE.WATER_M,
    position: {x: x + 1, y: BOTTOM_Y, z},
    speed: {x: speed, y: 0}
  })
  sprites.push({
    ...defaults(),
    texture: TEXTURE[cloud],
    position: {x, y, z},
    speed: {x: speed, y: 0}
  })
  return sprites
}

// todo: fix animation
export function newTree({x, y}: XY): Sprite[] {
  const z = DrawOrder.BACKGROUND_SCENERY
  return [{...defaults(), texture: TEXTURE.TREE, position: {x, y, z}}]
}
