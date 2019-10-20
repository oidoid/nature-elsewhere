import {AnimatorParser} from './AnimatorParser'
import {Atlas} from 'aseprite-atlas'
import {AtlasIDParser} from '../atlas/AtlasIDParser'
import {Image} from './Image'
import {ImageCompositionParser} from './ImageCompositionParser'
import {ImageConfig} from './ImageConfig'
import {LayerParser} from './LayerParser'
import {RectParser} from '../math/RectParser'
import {WHParser} from '../math/WHParser'
import {XY} from '../math/XY'
import {XYParser} from '../math/XYParser'
import {XYConfig} from '../math/XYConfig'

export namespace ImageParser {
  export function parse(atlas: Atlas, config: ImageConfig): Image {
    return Image.new(atlas, parseProps(config))
  }

  export function parseProps(config: ImageConfig): Image.Props {
    // Excessive spread conditionals cause compiler OOM errors, use if
    // assignments instead. E.g.,
    // `if (config.x !== undefined) props.x = config.x` instead of
    // `...config.x !== undefined && {x: config.x}`.
    // https://github.com/microsoft/TypeScript/issues/34599
    const props: Writable<Image.Props> = {id: AtlasIDParser.parse(config.id)}
    if (config.constituentID !== undefined)
      props.constituentID = AtlasIDParser.parse(config.constituentID)
    if (config.composition !== undefined)
      props.composition = ImageCompositionParser.parse(config.composition)
    if (config.bounds !== undefined)
      props.bounds = RectParser.parse(config.bounds)
    if (config.position !== undefined)
      props.position = XYParser.parse(config.position)
    if (config.x !== undefined) props.x = config.x
    if (config.y !== undefined) props.y = config.y
    if (config.size !== undefined) props.size = WHParser.parse(config.size)
    if (config.w !== undefined) props.w = config.w
    if (config.h !== undefined) props.h = config.h
    if (config.layer !== undefined)
      props.layer = LayerParser.parse(config.layer)
    if (config.scale !== undefined) props.scale = parseScale(config.scale)
    if (config.sx !== undefined) props.sx = config.sx
    if (config.sy !== undefined) props.sy = config.sy
    if (config.animator !== undefined)
      props.animator = AnimatorParser.parse(config.animator)
    if (config.period !== undefined) props.period = config.period
    if (config.exposure !== undefined) props.exposure = config.exposure
    if (config.wrap !== undefined) props.wrap = XYParser.parse(config.wrap)
    if (config.wx !== undefined) props.wx = config.wx
    if (config.wy !== undefined) props.wy = config.wy
    if (config.wrapVelocity !== undefined)
      props.wrapVelocity = XYParser.parse(config.wrapVelocity)
    if (config.wvx !== undefined) props.wvx = config.wvx
    if (config.wvy !== undefined) props.wvy = config.wvy
    return props
  }

  export function parseScale(config: XYConfig): XY {
    return new XY(config?.x ?? 1, config?.y ?? 1)
  }
}
