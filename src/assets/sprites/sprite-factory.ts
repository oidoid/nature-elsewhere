import {TEXTURE} from '../textures/texture'
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

export function newRainCloudS({x, y}: XY): Sprite[] {
  const texture = TEXTURE.RAIN
  const speed = {x: -0.1, y: 0}
  const scroll = {x: 0, y: -12}
  return [
    {...defaults(), texture, position: {x: x + 1, y: y + 16}, speed, scroll},
    {...defaults(), texture, position: {x: x + 1, y: y + 31}, speed, scroll},
    {...defaults(), texture, position: {x: x + 1, y: y + 40}, speed, scroll},
    {
      ...defaults(),
      texture: TEXTURE.WATER_M,
      position: {x: x + 1, y: y + 42},
      speed
    },
    {...defaults(), texture: TEXTURE.CLOUD_S, position: {x, y}, speed}
  ]
}

export function newTree(position: XY): Sprite[] {
  return [{...defaults(), texture: TEXTURE.TREE, position}]
}
