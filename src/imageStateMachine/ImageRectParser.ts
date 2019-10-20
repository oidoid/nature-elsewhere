import {Atlas} from 'aseprite-atlas'
import {ImageConfig} from '../image/ImageConfig'
import {ImageParser} from '../image/ImageParser'
import {ImageRect} from './ImageRect'
import {XYConfig} from '../math/XYConfig'
import {XYParser} from '../math/XYParser'

export type ImageRectConfig = Maybe<{
  readonly origin?: XYConfig
  readonly scale?: XYConfig
  readonly images?: readonly ImageConfig[]
}>

export namespace ImageRectParser {
  export function parse(atlas: Atlas, config: ImageRectConfig): ImageRect {
    if (!config) return new ImageRect()
    const origin = XYParser.parse(config.origin)
    const scale = ImageParser.parseScale(config.scale)
    const images = (config.images ?? []).map(image =>
      ImageParser.parse(atlas, image)
    )
    const rect = new ImageRect({origin, images, scale})
    return rect
  }
}
