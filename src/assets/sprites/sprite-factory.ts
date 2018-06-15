import {TEXTURE} from '../textures/texture'
import {XY} from '../../geo'
import {Sprite} from './sprite'

export function newPond(position: XY, flowRate: number): Sprite[] {
  return [
    {
      texture: TEXTURE.POND_WATER,
      position,
      celIndex: 0,
      flip: {x: false, y: false}
    },
    {
      texture: TEXTURE.POND_REFLECTIONS,
      position,
      scroll: {x: flowRate, y: 0},
      celIndex: 0,
      flip: {x: false, y: false}
    },
    {
      texture: TEXTURE.POND_MASK,
      position,
      celIndex: 0,
      flip: {x: false, y: false}
    }
  ]
}

export function newPlayer(position: XY): Sprite[] {
  return [
    {
      texture: TEXTURE.PLAYER_IDLE,
      position,
      celIndex: 0,
      flip: {x: false, y: false}
    }
  ]
}

export function newGrassL(position: XY): Sprite[] {
  return [
    {
      texture: TEXTURE.GRASS_L,
      position,
      celIndex: 0,
      flip: {x: false, y: false}
    }
  ]
}

export function newTree(position: XY): Sprite[] {
  return [
    {
      texture: TEXTURE.TREE,
      position,
      celIndex: 0,
      flip: {x: false, y: false}
    }
  ]
}
