import {Texture} from '../textures/texture'
import {XY} from '../../types/geo'

export enum SpriteType {
  PLAYER,
  OTHER
}

/** An instance of a texture. todo: revise terminology. */
export type Sprite = Readonly<{
  type: SpriteType
  texture: Texture
  celIndex: number
  scroll: XY
  scrollPosition: XY
  position: XY
  speed: XY
  scale: XY
}>
