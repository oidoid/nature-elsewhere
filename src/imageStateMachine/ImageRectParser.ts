import {ImageRect} from './ImageRect'
import {XYParser, XYConfig} from '../math/XYParser'
import {Atlas} from '../atlas/Atlas'
import {ImageParser, ImageConfig, ImageScaleConfig} from '../image/ImageParser'
import {Rect} from '../math/Rect'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

export type ImageRectConfig = Maybe<{
  readonly origin?: XYConfig
  readonly scale?: ImageScaleConfig
  readonly images?: readonly ImageConfig[]
}>

export namespace ImageRectParser {
  export function parse(config: ImageRectConfig, atlas: Atlas): ImageRect {
    if (!config)
      return {
        origin: new XY(0, 0),
        bounds: {position: new XY(0, 0), size: new WH(0, 0)},
        // Always use non-zero scaling so that Entity can determine
        // relative scaling of collision bodies.
        scale: new XY(1, 1),
        images: []
      }
    const images = (config.images || []).map(image =>
      ImageParser.parse(image, atlas)
    )
    const union = Rect.unionAll(images.map(image => image.bounds))
    const origin = XYParser.parse(config.origin)
    const bounds = union || {position: new XY(0, 0), size: new WH(0, 0)}
    const rect = {origin, bounds, scale: new XY(1, 1), images}
    ImageRect.scale(rect, ImageParser.parseScale(config.scale))
    return rect
  }
}
