import * as loader from '../assets/asset-loader'
import * as palette from './palette'
export namespace Level0 {
  export type Assets = loader.Assets<typeof Texture>
  export enum Texture {
    Atlas = '/assets/textures/atlas.png'
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
        url: Texture.Atlas
      },
      {
        // reflections
        texturePosition: {x: 1, y: 0},
        location: {x: 32, y: 64},
        bounds: {width: 128, height: 16},
        url: Texture.Atlas,
        textureOffset: {x: -1, y: 0} // in units of texture width per second
      },
      {
        // mask
        texturePosition: {x: 1, y: 36},
        location: {x: 32, y: 64},
        bounds: {width: 128, height: 16},
        url: Texture.Atlas
      }
    ]
  }
}
