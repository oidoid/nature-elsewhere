import * as loader from '../asset-loader'
import * as palette from './palette'
export namespace Level0 {
  export type Assets = loader.Assets<typeof Texture>
  export enum Texture {
    ATLAS = '/assets/textures/atlas.png'
  }
  export const Map = {
    width: 1024,
    height: 128,
    backgroundColor: palette.base,
    atlasBounds: {x: 256, y: 128},
    drawables: [
      {
        // water
        texturePosition: {x: 1, y: 18},
        location: {x: 32, y: 64},
        bounds: {width: 128, height: 16},
        url: Texture.ATLAS
      },
      {
        // reflections
        texturePosition: {x: 1, y: 0},
        location: {x: 32, y: 64},
        bounds: {width: 128, height: 16},
        url: Texture.ATLAS,
        textureOffset: {x: -1, y: 0} // in units of texture width per second
      },
      {
        // mask
        texturePosition: {x: 1, y: 36},
        location: {x: 32, y: 64},
        bounds: {width: 128, height: 16},
        url: Texture.ATLAS
      }
    ]
  }
}
