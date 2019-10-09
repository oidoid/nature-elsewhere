import {
  AlphaCompositionConfig,
  AlphaCompositionParser
} from './AlphaCompositionParser'
import {Animator, Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {AtlasIDConfig, AtlasIDParser} from '../atlas/AtlasIDParser'
import {
  DecamillipixelIntXYConfig,
  DecamillipixelIntXYParser
} from '../math/DecamillipixelXYParser'
import {Image} from './Image'
import {RectConfig} from '../math/RectParser'
import {XYConfig} from '../math/XYParser'
import {XYParser} from '../math/XYParser'
import {XY} from '../math/XY'
import {ObjectUtil} from '../utils/ObjectUtil'
import {Layer} from './Layer'
import {WH} from '../math/WH'

export interface ImageConfig {
  readonly id: AtlasIDConfig
  readonly imageID?: AtlasIDConfig
  readonly bounds?: RectConfig
  readonly layer?: LayerConfig
  readonly animator?: AnimatorConfig
  readonly scale?: XYConfig
  readonly wrap?: DecamillipixelIntXYConfig
  readonly wrapVelocity?: DecamillipixelIntXYConfig
  readonly alphaComposition?: AlphaCompositionConfig
}

export type AnimatorConfig = Readonly<{
  period?: number
  exposure?: Milliseconds
}>

/** Defaults to (1, 1). */
export type ImageScaleConfig = Maybe<Partial<XY>>
export type LayerConfig = Maybe<Layer>

export namespace ImageParser {
  export function parse(config: ImageConfig, atlas: Atlas): Image {
    const id = AtlasIDParser.parse(config.id)
    return new Image(atlas, {
      id,
      imageID: config.imageID ? AtlasIDParser.parse(config.imageID) : undefined,
      position: XYParser.parse(
        config.bounds ? config.bounds.position : undefined
      ),
      size: parseSize(config, id, atlas),
      layer: parseLayer(config.layer),
      animator: config.animator ? parseAnimator(config.animator) : undefined,
      scale: parseScale(config.scale),
      wrap: DecamillipixelIntXYParser.parse(config.wrap),
      wrapVelocity: DecamillipixelIntXYParser.parse(config.wrapVelocity),
      alphaComposition: AlphaCompositionParser.parse(config.alphaComposition)
    })
  }

  export function parseScale(config: ImageScaleConfig): XY {
    return new XY(
      config && config.x !== undefined ? config.x : 1,
      config && config.y !== undefined ? config.y : 1
    )
  }

  export function parseLayer(config: LayerConfig): Layer {
    const layer = config === undefined ? Layer.DEFAULT : config
    ObjectUtil.assertKeyOf(Layer, layer, 'Layer')
    return layer
  }
}

function parseSize(config: ImageConfig, id: AtlasID, atlas: Atlas): WH {
  const w =
    config.bounds && config.bounds.size && config.bounds.size.w !== undefined
      ? config.bounds.size.w
      : Math.abs(config.scale && config.scale.x ? config.scale.x : 1) *
        atlas.animations[id].size.w
  const h =
    config.bounds && config.bounds.size && config.bounds.size.h !== undefined
      ? config.bounds.size.h
      : Math.abs(config.scale && config.scale.y ? config.scale.y : 1) *
        atlas.animations[id].size.h
  return new WH(w, h)
}

function parseAnimator(config: AnimatorConfig): Animator {
  return {period: config.period || 0, exposure: config.exposure || 0}
}
