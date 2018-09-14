import {Texture} from '../textures/texture'
import {XY, XYZ} from '../../types/geo'

export enum SpriteType {
  PLAYER,
  OTHER
}

export enum DrawOrder {
  BACKGROUND = 1000, // MAX_DEPTH in texture-atlas.vert.
  BACKGROUND_SCENERY = 4,
  PLAYER = 3,
  FOREGROUND_SCENERY = 2,
  CLOUDS = 1,
  FOREGROUND = 0
}
// copy context saving, pasuing, and other 01 functionality

/** An instance of a texture. todo: revise terminology.
 * should this be called an instance and a sprite is a group of instances? */
export type Sprite = {
  type: SpriteType
  texture: Texture
  celIndex: number
  position: XYZ
  scale: XY
  speed: XY
  scrollSpeed: XY
  scrollPosition: XY
}
