import {SpriteConfig} from '../sprite/SpriteConfig'
import {XYConfig} from '../math/XYConfig'

export type SpriteRectConfig = Maybe<{
  readonly origin?: XYConfig
  readonly scale?: XYConfig
  readonly sprites?: readonly SpriteConfig[]
}>
