import {AnimatorParser} from '../animator/animator-parser'
import {Atlas} from '../../atlas/atlas'
import {AtlasID} from '../../atlas/atlas-id'
import {AtlasIDParser} from '../../atlas/atlas-id-parser'
import {DecamillipixelIntXYParser} from '../decamillipixel-int-xy/decamillipixel-xy-parser'
import {ImageConfig} from './image-config'
import {Image} from './image'
import {ImageScaleParser} from '../image-scale/image-scale-parser'
import {LayerParser} from '../layer/layer-parser'
import {Rect} from '../../math/rect'
import {XYParser} from '../../math/parsers/xy-parser'

export namespace ImageParser {
  export function parse(config: ImageConfig, atlas: Atlas): Image {
    const id = AtlasIDParser.parse(config.id)
    return {
      id,
      bounds: parseBounds(config, id, atlas),
      layer: LayerParser.parse(config.layer),
      animator: AnimatorParser.parse(config.animator),
      scale: ImageScaleParser.parse(config.scale),
      wrap: DecamillipixelIntXYParser.parse(config.wrap),
      wrapVelocity: DecamillipixelIntXYParser.parse(config.wrapVelocity)
    }
  }
}

function parseBounds(config: ImageConfig, id: AtlasID, atlas: Atlas): Rect {
  const w =
    config.bounds && config.bounds.w !== undefined
      ? config.bounds.w
      : Math.abs(config.scale && config.scale.x ? config.scale.x : 1) *
        atlas[id].size.w
  const h =
    config.bounds && config.bounds.h !== undefined
      ? config.bounds.h
      : Math.abs(config.scale && config.scale.y ? config.scale.y : 1) *
        atlas[id].size.h
  const xy = XYParser.parse(config.bounds)
  return {...xy, w, h}
}
