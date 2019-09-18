import {ImageRect} from './image-rect'
import {ImageRectConfig} from './image-rect-config'
import {XYParser} from '../../math/parsers/xy-parser'
import {RectArray} from '../../math/rect-array'
import {Image} from '../image/image'
import {Atlas} from '../../atlas/atlas/atlas'
import {ImageScaleParser} from '../image-scale/image-scale-parser'
import {ImageParser} from '../image/image-parser'

export namespace ImageRectParser {
  export function parse(config: ImageRectConfig, atlas: Atlas): ImageRect {
    if (!config)
      return {bounds: {x: 0, y: 0, w: 0, h: 0}, scale: {x: 1, y: 1}, images: []}
    const position = XYParser.parse(config.position)
    const images = (config.images || []).map(image =>
      ImageParser.parse(image, atlas)
    )
    images.forEach(image => Image.moveBy(image, position))
    const union = RectArray.union(images.map(image => image.bounds))
    const rect = {
      bounds: union || {...position, w: 0, h: 0},
      scale: {x: 1, y: 1},
      images
    }
    ImageRect.scale(rect, ImageScaleParser.parse(config.scale))
    return rect
  }
}
