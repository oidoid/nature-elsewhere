import {
  AlphaCompositionConfig,
  AlphaCompositionParser
} from './AlphaCompositionParser'
import {Animator, Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {AtlasIDConfig, AtlasIDParser} from '../atlas/AtlasIDParser'
import {Image} from './Image'
import {RectConfig} from '../math/RectParser'
import {XY} from '../math/XY'
import {ObjectUtil} from '../utils/ObjectUtil'
import {Layer} from './Layer'
import {WH} from '../math/WH'
import {XYConfig, XYParser} from '../math/XYParser'

export interface ImageConfig {
  readonly id: AtlasIDConfig
  readonly imageID?: AtlasIDConfig
  readonly bounds?: RectConfig
  readonly layer?: Exclude<LayerConfig, undefined> & string
  readonly animator?: AnimatorConfig
  readonly scale?: XYConfig
  readonly wrap?: XYConfig // Decamillipixel
  readonly wrapVelocity?: XYConfig // Decamillipixel
  readonly alphaComposition?: Exclude<AlphaCompositionConfig, undefined> &
    string
}

export type AnimatorConfig = Readonly<{
  period?: number
  exposure?: Milliseconds
}>

/** Defaults to (1, 1). */
export type ImageScaleConfig = Maybe<Partial<XY>>
export type LayerConfig = Maybe<string | number | Layer>

export namespace ImageParser {
  export function parse(config: ImageConfig, atlas: Atlas): Image {
    const id = AtlasIDParser.parse(config.id)
    return new Image(atlas, {
      id,
      ...(config.imageID !== undefined && {
        imageID: AtlasIDParser.parse(config.imageID)
      }),
      ...(config.bounds?.position !== undefined && {
        position: XYParser.parse(config.bounds?.position)
      }),
      size: parseSize(config, id, atlas),
      ...(config.layer !== undefined && {layer: parseLayer(config.layer)}),
      ...(config.animator !== undefined && {
        animator: parseAnimator(config.animator)
      }),
      ...(config.scale !== undefined && {scale: parseScale(config.scale)}),
      ...(config.wrap !== undefined && {wrap: XYParser.parse(config.wrap)}),
      ...(config.wrapVelocity !== undefined && {
        wrapVelocity: XYParser.parse(config.wrapVelocity)
      }),
      ...(config.alphaComposition !== undefined && {
        alphaComposition: AlphaCompositionParser.parse(config.alphaComposition)
      })
    })
  }

  export function parseScale(config: ImageScaleConfig): XY {
    return new XY(config?.x ?? 1, config?.y ?? 1)
  }

  export function parseLayer(config: LayerConfig): Layer {
    const layer = config === undefined ? Layer.DEFAULT : config
    ObjectUtil.assertKeyOf(Layer, layer, 'Layer')
    return typeof layer === 'number' ? layer : Layer[<keyof typeof Layer>layer]
  }
}

function parseSize(config: ImageConfig, id: AtlasID, atlas: Atlas): WH {
  const w =
    config.bounds?.size?.w ??
    Math.abs(config.scale && config.scale.x ? config.scale.x : 1) *
      atlas.animations[id].size.w
  const h =
    config.bounds?.size?.h ??
    Math.abs(config.scale && config.scale.y ? config.scale.y : 1) *
      atlas.animations[id].size.h
  return new WH(w, h)
}

function parseAnimator(config: AnimatorConfig): Animator {
  return {period: config.period ?? 0, exposure: config.exposure ?? 0}
}
