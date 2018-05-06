import {Texture} from '../textures/texture'
import {XY} from '../../geo'

/** An instance of a texture. todo: revise terminology. */
export type Sprite = {
  texture: Texture
  scroll?: XY
  position: XY
}
