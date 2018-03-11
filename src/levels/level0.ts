import * as loader from '../assets/asset-loader'
import * as palette from './palette'
export namespace Level0 {
  export type Assets = loader.Assets<typeof Texture>
  export enum Texture {
    POND = '/assets/textures/pond.png',
    REFLECTIONS = '/assets/textures/reflections.png',
    WATER = '/assets/textures/water.png'
  }
  export const Map = {
    width: 1024,
    height: 128,
    backgroundColor: palette.base,
    drawables: [
      {
        location: {x: 32, y: 64},
        bounds: {width: 128, height: 16},
        url: Texture.WATER
      },
      {
        location: {x: 32, y: 64},
        bounds: {width: 128, height: 16},
        url: Texture.REFLECTIONS,
        speed: 1 // in pixels per second
      },
      {
        location: {x: 32, y: 64},
        bounds: {width: 128, height: 16},
        url: Texture.POND
      }
    ]
  }
}
