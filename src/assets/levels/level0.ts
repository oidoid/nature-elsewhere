import * as loader from '../asset-loader'
import * as palette from './palette'
import {Sprite} from './sprite'
import {XY} from '../../geo'

export function newPond(position: XY, flowRate: number): Sprite[] {
  const textureURL = Level0.Texture.ATLAS
  return [
    {textureURL, textureID: 'pond water', position},
    {
      textureURL,
      textureID: 'pond reflections',
      position,
      scroll: {x: flowRate, y: 0}
    },
    {textureURL, textureID: 'pond mask', position}
  ]
}

export namespace Level0 {
  export type Assets = loader.Assets<typeof Texture>

  export enum Texture {
    ATLAS = '/assets/textures/atlas.png'
  }

  export const Map = {
    width: 1024,
    height: 128,
    backgroundColor: palette.base,
    sprites: newPond({x: 32, y: 64}, -1)
  }
}
