import * as loader from '../asset-loader'
import * as palette from './palette'
import * as SpriteFactory from '../sprites/sprite-factory'

export namespace Level0 {
  export type Assets = loader.Assets<typeof Texture>

  export enum Texture {
    ATLAS = '/assets/textures/atlas.png'
  }

  export const Map = {
    width: 1024,
    height: 128,
    backgroundColor: palette.base,
    sprites: SpriteFactory.newPond({x: 32, y: 64}, -1)
  }
}
