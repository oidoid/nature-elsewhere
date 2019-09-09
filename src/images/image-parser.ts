import {Atlas} from '../atlas/atlas'
import {Image} from './image'
import {ImageConfig} from './image-config'
import * as imageDefaults from '../assets/image.json'
import {JSONUtil} from '../utils/json-util'
import {Layer} from './layer'
import {WH} from '../math/wh'
import {XY} from '../math/xy'

export namespace ImageParser {
  export const parse = (atlas: Atlas, cfg: ImageConfig): Image => {
    if (!(cfg.id in atlas))
      throw new Error(`Atlas missing animation "${cfg.id}".`)
    const wh = parseWH(atlas, cfg)
    const ret = <Image>JSONUtil.merge(imageDefaults, wh, <any>cfg)
    const layer = ret.layer
    if (!isLayerKey(layer)) throw new Error(`Unknown Layer.Key "${layer}".`)
    const scale =
      cfg.scale && cfg.scale.x && cfg.scale.y ? <XY>cfg.scale : ret.scale
    return {...ret, scale}
  }
}

const parseWH = (atlas: Atlas, cfg: ImageConfig): WH => ({
  w: Math.abs(cfg.scale && cfg.scale.x ? cfg.scale.x : 1) * atlas[cfg.id].w,
  h: Math.abs(cfg.scale && cfg.scale.y ? cfg.scale.y : 1) * atlas[cfg.id].h
})

const isLayerKey = (val: string): val is Layer.Key => val in Layer
