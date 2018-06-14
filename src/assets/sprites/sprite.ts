import {Texture} from '../textures/texture'
import {XY} from '../../geo'

/** An instance of a texture. todo: revise terminology. */
export type Sprite = {
  texture: Texture
  celIndex: number
  scroll?: XY
  position: XY
  flip: {x: boolean; y: boolean}
}
