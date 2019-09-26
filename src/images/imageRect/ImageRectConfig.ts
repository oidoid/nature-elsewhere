import {ImageConfig} from '../image/ImageConfig'
import {ImageScaleConfig} from '../imageScale/ImageScaleConfig'
import {XYConfig} from '../../math/xy/XYParser'

export type ImageRectConfig = Maybe<{
  readonly origin?: XYConfig
  readonly scale?: ImageScaleConfig
  readonly images?: readonly ImageConfig[]
}>
