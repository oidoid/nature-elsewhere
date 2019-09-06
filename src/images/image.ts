import {Animator} from './animator'
import {Atlas} from '../atlas/atlas'
import * as imageDefaults from '../assets/image.json'
import {JSONUtil} from '../utils/json-util'
import {Layer} from './layer'
import {Limits} from '../math/limits'
import {Rect} from '../math/rect'
import {XY} from '../math/xy'

/** A mapping from a source atlas subtexture to a target. The target region
    is used for rendering. The image may be animated. Each Cel has the same
    size. Specifying a different target width or height than the source
    truncates or repeats the scaled rendered source.
    Bounds (x, y, w, and h members) are the union of all Entity images. This is
    used for quick collision detections such checking if the Entity is on
    screen. x and y are in in level coordinates. */
export interface Image extends Required<Image.Config> {
  readonly scale: XY
  readonly layer: Layer.Key
}

export namespace Image {
  export interface Config extends Partial<Rect>, Partial<Animator> {
    readonly id: string
    readonly layer?: Layer.Key | string
    readonly scale?: Partial<XY>
    readonly tx?: number
    readonly ty?: number
    readonly tvx?: number
    readonly tvy?: number
  }

  export function make(atlas: Atlas, cfg: Config): Image {
    if (!(cfg.id in atlas))
      throw new Error(`Atlas missing animation "${cfg.id}".`)
    const wh = {
      w: Math.abs(cfg.scale && cfg.scale.x ? cfg.scale.x : 1) * atlas[cfg.id].w,
      h: Math.abs(cfg.scale && cfg.scale.y ? cfg.scale.y : 1) * atlas[cfg.id].h
    }
    const ret = <Image>JSONUtil.merge(imageDefaults, wh, <any>cfg)
    const layer = ret.layer
    if (!isLayerKey(layer)) throw new Error(`Unknown Layer.Key "${layer}".`)
    const scale =
      cfg.scale && cfg.scale.x && cfg.scale.y ? <XY>cfg.scale : ret.scale
    return {...ret, scale}
  }

  function isLayerKey(val: string): val is Layer.Key {
    return val in Layer
  }

  /** For sorting by draw order. E.g., `images.sort(Image.compare)`. */
  export function compare(lhs: Image, rhs: Image): number {
    const layer = Layer[lhs.layer] - Layer[rhs.layer]
    return layer || lhs.y + lhs.h - (rhs.y + rhs.h)
  }

  export function animate(state: Image, atlas: Atlas, time: number): Image {
    const exposure = state.exposure + time
    const animator = Animator.animate(atlas[state.id], state.period, exposure)
    return Object.assign(state, animator)
  }

  export function cel({id, period}: Image, atlas: Atlas): Atlas.Cel {
    return atlas[id].cels[Animator.index(atlas[id].cels, period)]
  }

  export function target(...images: readonly Image[]): Rect {
    const rects: readonly Rect[] = images
    const fallback = {x: Limits.MIN_SHORT, y: Limits.MIN_SHORT, w: 0, h: 0}
    const union = rects.length ? rects.reduce(Rect.union) : fallback
    return {w: union.w, h: union.h, x: union.x, y: union.y}
  }
}
