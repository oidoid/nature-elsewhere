import {Texture} from '../textures/texture'
import {XY} from '../../types/geo'

export enum SpriteType {
  PLAYER,
  OTHER
}

/** An instance of a texture. todo: revise terminology. */
export type Sprite = {
  readonly type: SpriteType
  readonly texture: Texture
  readonly celIndex: number
  readonly scroll: XY
  readonly scrollPosition: XY
  readonly position: XY
  readonly speed: XY
  readonly flip: {readonly x: boolean; readonly y: boolean}
}
