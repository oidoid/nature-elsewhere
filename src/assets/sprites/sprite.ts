import {Texture} from '../textures/texture'
import {XY, XYZ} from '../../types/geo'

export enum SpriteType {
  PLAYER,
  OTHER
}

export enum DrawOrder {
  BACKGROUND = 1,
  BACKGROUND_SCENERY = 0.4,
  PLAYER = 0.3,
  FOREGROUND_SCENERY = 0.2,
  CLOUDS = 0.1,
  FOREGROUND = 0
}

/** An instance of a texture. todo: revise terminology. */
export type Sprite = {
  type: SpriteType
  texture: Texture
  celIndex: number
  position: XYZ
  scale: XY
  speed: XY
  scrollSpeed: XY
  scrollPosition: XY
  invalidated: boolean
}
