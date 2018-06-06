import {TEXTURE} from '../textures/texture'
import {XY} from '../../geo'
import {Sprite} from './sprite'

export function newPond(position: XY, flowRate: number): Sprite[] {
  return [
    {texture: TEXTURE.POND_WATER, position},
    {texture: TEXTURE.POND_REFLECTIONS, position, scroll: {x: flowRate, y: 0}},
    {texture: TEXTURE.POND_MASK, position}
  ]
}

export function newPlayer(position: XY): Sprite[] {
  return [{texture: TEXTURE.PLAYER_IDLE, position}]
}
