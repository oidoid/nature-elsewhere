import * as loader from '../assets/asset-loader'
export namespace Level0 {
  export type Assets = loader.Assets<typeof Texture>
  export enum Texture {
    POND = '/assets/textures/pond.png',
    REFLECTIONS = '/assets/textures/reflections.png',
    WATER = '/assets/textures/water.png'
  }
}
