import {Atlas} from 'aseprite-atlas'
import {ImageConfig, ImageParser, ImageScaleConfig} from '../image/ImageParser'
import {ImageRect} from './ImageRect'
import {Rect} from '../math/Rect'
import {XYConfig, XYParser} from '../math/XYParser'

export type ImageRectConfig = Maybe<{
  readonly origin?: XYConfig
  readonly scale?: ImageScaleConfig
  readonly images?: readonly ImageConfig[]
}>

export namespace ImageRectParser {
  export function parse(config: ImageRectConfig, atlas: Atlas): ImageRect {
    if (!config) return new ImageRect()
    const images = (config.images || []).map(image =>
      ImageParser.parse(image, atlas)
    )
    const union = Rect.unionAll(images.map(image => image.bounds))
    const origin = XYParser.parse(config.origin)
    const rect = new ImageRect({origin, bounds: union, images})
    rect.scaleBy(ImageParser.parseScale(config.scale))
    return rect
  }
}
