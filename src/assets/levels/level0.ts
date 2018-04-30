import * as loader from '../asset-loader'
import * as palette from './palette'
import {Sprite} from './sprite'

export namespace Level0 {
  export type Assets = loader.Assets<typeof Texture>

  export enum Texture {
    ATLAS = '/assets/textures/atlas.png'
  }

  export const POND: Sprite[] = [
    {
      textureURL: Texture.ATLAS,
      textureID: 'pond water',
      position: {x: 32, y: 64}
    },
    {
      textureURL: Texture.ATLAS,
      textureID: 'pond reflections',
      position: {x: 32, y: 64},
      textureOffset: {x: -1, y: 0} // in units of texture width per second???
    },
    {
      textureURL: Texture.ATLAS,
      textureID: 'pond mask',
      position: {x: 32, y: 64}
    }
  ]

  export const Map = {
    width: 1024,
    height: 128,
    backgroundColor: palette.base,
    sprites: POND
  }
}
