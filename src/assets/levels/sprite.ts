import * as TextureAtlas from '../textures/texture-atlas'
import {XY} from '../../geo'

export type Sprite = {
  textureURL: string
  textureID: TextureAtlas.TextureID
  textureOffset?: XY
  position: XY
}
