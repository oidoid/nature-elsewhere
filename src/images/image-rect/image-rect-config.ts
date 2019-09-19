import {ImageConfig} from '../image/image-config'
import {XYConfig} from '../../math/xy/xy-config'
import {ImageScaleConfig} from '../image-scale/image-scale-config'

export type ImageRectConfig = Maybe<{
  readonly position?: XYConfig
  readonly scale?: ImageScaleConfig
  readonly images?: readonly ImageConfig[]
}>
