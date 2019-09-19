import {ImageRect} from './image-rect'
import {ImageRectConfig} from './image-rect-config'
import {XYParser} from '../../math/xy/xy-parser'
import {RectArray} from '../../math/rect-array/rect-array'
import {Image} from '../image/image'
import {Atlas} from '../../atlas/atlas/atlas'
import {ImageScaleParser} from '../image-scale/image-scale-parser'
import {ImageParser} from '../image/image-parser'
import {XY} from '../../math/xy/xy'

export namespace ImageRectParser {
  export function parse(config: ImageRectConfig, atlas: Atlas): ImageRect {
    if (!config)
      return {bounds: {x: 0, y: 0, w: 0, h: 0}, scale: {x: 1, y: 1}, images: []}
    const images = (config.images || []).map(image =>
      ImageParser.parse(image, atlas)
    )
    const union = RectArray.union(images.map(image => image.bounds))
    const position = XYParser.parse(config.position)
    const origin = union ? XY.add({x: union.x, y: union.y}, position) : position
    images.forEach(image => Image.moveBy(image, origin))
    const bounds = {
      x: origin.x,
      y: origin.y,
      w: union ? union.w : 0,
      h: union ? union.h : 0
    }
    const rect = {bounds, scale: {x: 1, y: 1}, images}
    ImageRect.scale(rect, ImageScaleParser.parse(config.scale))
    return rect
  }
}
