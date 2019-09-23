import {ImageRect} from './ImageRect'
import {ImageRectConfig} from './ImageRectConfig'
import {XYParser} from '../../math/xy/XYParser'
import {Atlas} from '../../atlas/atlas/Atlas'
import {ImageScaleParser} from '../imageScale/ImageScaleParser'
import {ImageParser} from '../image/ImageParser'
import {Rect} from '../../math/rect/Rect'

export namespace ImageRectParser {
  export function parse(config: ImageRectConfig, atlas: Atlas): ImageRect {
    if (!config)
      return {
        origin: {x: 0, y: 0},
        bounds: {x: 0, y: 0, w: 0, h: 0},
        scale: {x: 0, y: 0},
        images: []
      }
    const images = (config.images || []).map(image =>
      ImageParser.parse(image, atlas)
    )
    const union = Rect.unionAll(images.map(image => image.bounds))
    const origin = XYParser.parse(config.origin)
    const bounds = union || {x: 0, y: 0, w: 0, h: 0}
    const rect = {origin, bounds, scale: {x: 1, y: 1}, images}
    ImageRect.scale(rect, ImageScaleParser.parse(config.scale))
    return rect
  }
}