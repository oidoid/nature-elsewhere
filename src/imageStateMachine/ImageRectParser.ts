import {Atlas} from 'aseprite-atlas'
import {ImageConfig, ImageParser, ImageScaleConfig} from '../image/ImageParser'
import {ImageRect} from './ImageRect'
import {XYConfig, XYParser} from '../math/XYParser'

export type ImageRectConfig = Maybe<{
  readonly origin?: XYConfig
  readonly scale?: ImageScaleConfig
  readonly images?: readonly ImageConfig[]
}>

export namespace ImageRectParser {
  export function parse(config: ImageRectConfig, atlas: Atlas): ImageRect {
    if (!config) return new ImageRect()
    const origin = XYParser.parse(config.origin)
    const scale = ImageParser.parseScale(config.scale)
    const images = (config.images ?? []).map(image =>
      ImageParser.parse(image, atlas)
    )
    const rect = new ImageRect({origin, images, scale})
    return rect
  }
}
