import {Texture} from '../textures/texture'
import {XY} from '../../types/geo'

/** An instance of a texture. todo: revise terminology. */
export type Sprite = {
  texture: Texture
  celIndex: number
  scroll: XY
  scrollPosition: XY
  position: XY
  speed: XY
  flip: {x: boolean; y: boolean}
}
