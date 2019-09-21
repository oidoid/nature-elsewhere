import {ImageConfig} from '../image/ImageConfig'
import {XYConfig} from '../../math/xy/XYConfig'
import {ImageScaleConfig} from '../imageScale/ImageScaleConfig'

export type ImageRectConfig = Maybe<{
  readonly origin?: XYConfig
  readonly scale?: ImageScaleConfig
  readonly images?: readonly ImageConfig[]
}>
