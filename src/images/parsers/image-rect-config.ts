import {ImageConfig} from './image-config'
import {XYConfig} from '../../math/parsers/xy-config'
import {ImageScaleConfig} from './image-scale-config'

export type ImageRectConfig = Maybe<{
  readonly position?: XYConfig
  readonly flip?: ImageScaleConfig
  readonly images?: readonly ImageConfig[]
}>
