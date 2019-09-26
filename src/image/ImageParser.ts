import {
  AlphaCompositionParser,
  AlphaCompositionKeyConfig
} from './AlphaCompositionParser'
import {AnimatorParser, AnimatorConfig} from '../animator/AnimatorParser'
import {Atlas} from '../atlas/Atlas'
import {AtlasID} from '../atlas/AtlasID'
import {AtlasIDParser, AtlasIDConfig} from '../atlas/AtlasIDParser'
import {
  DecamillipixelIntXYParser,
  DecamillipixelIntXYConfig
} from '../math/DecamillipixelXYParser'
import {Image} from './Image'
import {RectConfig} from '../math/RectParser'
import {Rect} from '../math/Rect'
import {XYConfig} from '../math/XYParser'
import {XYParser} from '../math/XYParser'
import {XY} from '../math/XY'
import {ObjectUtil} from '../utils/ObjectUtil'
import {Layer} from './Layer'

export interface ImageConfig {
  readonly id: AtlasIDConfig
  readonly imageID?: AtlasIDConfig
  readonly bounds?: RectConfig
  readonly layer?: LayerKeyConfig
  readonly animator?: AnimatorConfig
  readonly scale?: XYConfig
  readonly wrap?: DecamillipixelIntXYConfig
  readonly wrapVelocity?: DecamillipixelIntXYConfig
  readonly alphaComposition?: AlphaCompositionKeyConfig
}

/** Defaults to (1, 1). */
export type ImageScaleConfig = Maybe<Partial<XY>>
export type LayerKeyConfig = Maybe<Layer.Key | string>

export namespace ImageParser {
  export function parse(config: ImageConfig, atlas: Atlas): Image {
    const id = AtlasIDParser.parse(config.id)
    const imageID = AtlasIDParser.parse(config.imageID || config.id)
    return {
      id,
      imageID,
      bounds: parseBounds(config, id, atlas),
      layer: parseLayerKey(config.layer),
      animator: AnimatorParser.parse(config.animator),
      scale: parseScale(config.scale),
      wrap: DecamillipixelIntXYParser.parse(config.wrap),
      wrapVelocity: DecamillipixelIntXYParser.parse(config.wrapVelocity),
      alphaComposition: AlphaCompositionParser.parseKey(config.alphaComposition)
    }
  }

  export function parseScale(config: ImageScaleConfig): XY {
    return {
      x: config && config.x !== undefined ? config.x : 1,
      y: config && config.y !== undefined ? config.y : 1
    }
  }

  export function parseLayerKey(config: LayerKeyConfig): Layer {
    const key = config || 'DEFAULT'
    if (ObjectUtil.assertKeyOf(Layer, key, 'Layer.Key')) return Layer[key]
    throw new Error()
  }
}

function parseBounds(config: ImageConfig, id: AtlasID, atlas: Atlas): Rect {
  const w =
    config.bounds && config.bounds.size && config.bounds.size.w !== undefined
      ? config.bounds.size.w
      : Math.abs(config.scale && config.scale.x ? config.scale.x : 1) *
        atlas[id].size.w
  const h =
    config.bounds && config.bounds.size && config.bounds.size.h !== undefined
      ? config.bounds.size.h
      : Math.abs(config.scale && config.scale.y ? config.scale.y : 1) *
        atlas[id].size.h
  const position = XYParser.parse(
    config.bounds ? config.bounds.position : undefined
  )
  return {position, size: {w, h}}
}
