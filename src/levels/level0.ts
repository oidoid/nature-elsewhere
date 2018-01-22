import {Assets} from '../assets/asset-loader'
export type AssetTexture = Assets<typeof Texture>
export enum Texture {
  POND = '/assets/textures/pond.png',
  REFLECTIONS = '/assets/textures/reflections.png',
  WATER = '/assets/textures/water.png'
}
