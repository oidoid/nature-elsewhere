import {TEXTURE, CloudTextureKey} from '../textures/texture'
import {XY} from '../../geo'
import {Sprite} from './sprite'

function defaults() {
  return {
    speed: {x: 0, y: 0},
    celIndex: 0,
    flip: {x: false, y: false},
    scroll: {x: 0, y: 0},
    scrollPosition: {x: 0, y: 0}
  }
}

export function newCloudS(position: XY): Sprite[] {
  return [{...defaults(), texture: TEXTURE.CLOUD_S, position}]
}

export function newCloudM(position: XY): Sprite[] {
  return [{...defaults(), texture: TEXTURE.CLOUD_M, position}]
}

export function newCloudL(position: XY): Sprite[] {
  return [{...defaults(), texture: TEXTURE.CLOUD_L, position}]
}

export function newCloudXL(position: XY): Sprite[] {
  return [{...defaults(), texture: TEXTURE.CLOUD_XL, position}]
}

export function newGrassL(position: XY): Sprite[] {
  return [{...defaults(), texture: TEXTURE.GRASS_L, position}]
}

export function newPlayer(position: XY): Sprite[] {
  return [{...defaults(), texture: TEXTURE.PLAYER_IDLE, position}]
}

export function newPond(position: XY, flowRate: number): Sprite[] {
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

export function newQuicksand(position: XY, flowRate: number): Sprite[] {
  return [
    {
      ...defaults(),
      texture: TEXTURE.QUICKSAND,
      position,
      scroll: {x: flowRate, y: 0}
    }
  ]
}

const BOTTOM_Y = 60

export function newRainCloud(
  cloud: CloudTextureKey,
  {x, y}: XY,
  speed: number
): Sprite[] {
  const sprites: Sprite[] = []
  for (let i = 0; i < (64 - y) / 16; ++i) {
    sprites.push({
      ...defaults(),
      texture: TEXTURE.RAIN,
      position: {
        x: x + Math.round(i / 2),
        y: y + 15 + i * 16 - Math.max(0, y + 15 + i * 16 - BOTTOM_Y)
      },
      speed: {x: speed, y: 0},
      scroll: {x: 0, y: -12}
    })
  }
  sprites.push({
    ...defaults(),
    texture: TEXTURE.WATER_M,
    position: {x: x + 1, y: BOTTOM_Y},
    speed: {x: speed, y: 0}
  })
  sprites.push({
    ...defaults(),
    texture: TEXTURE[cloud],
    position: {x, y},
    speed: {x: speed, y: 0}
  })
  return sprites
}

export function newTree(position: XY): Sprite[] {
  return [{...defaults(), texture: TEXTURE.TREE, position}]
}
