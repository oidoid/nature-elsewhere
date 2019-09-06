import {Animator} from './animator'
import {Atlas} from '../atlas/atlas'
import * as imageDefaults from '../assets/image.json'
import {JSONUtil} from '../utils/json-util'
import {Layer} from './layer'
import {Limits} from '../math/limits'
import {Rect} from '../math/rect'
import {XY} from '../math/xy'

/** A mapping from a source atlas subtexture to a target. The target region
    is used for rendering and collision detection. The image may be animated.
    Each Cel has the same size. Specifying a different target width or height
    than the source truncates or repeats the scaled rendered source. */
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

  export const collides = (
    lhs: Image,
    rhs: Image,
    atlas: Atlas,
    {x, y}: XY // Overrides lhs.xy
  ): Rect | undefined => {
    // The bounds of each image are supersets of the unions of the collision
    // data of each. If the two bounds do not intersect, the collision subsets
    // also cannot intersect.
    if (!Rect.intersects({x, y, w: lhs.w, h: lhs.h}, rhs)) return

    return Image.cel(lhs, atlas).collisions.find(val =>
      collidesRect(rhs, {x: x + val.x, y: y + val.y, w: val.w, h: val.h}, atlas)
    )
  }

  export const collidesRect = (
    state: Image,
    rect: Rect,
    atlas: Atlas
  ): Rect | undefined => {
    // The image bounds are a superset of the union of the image's collision
    // data in level coordinates. Rect is also given in level coordinates. If
    // the two bounds do not intersect, the image's collision subset also cannot
    // intersect.
    if (!Rect.intersects(state, rect)) return

    // Collision data is relative (0, 0). Translate the input rect by the image
    // level coordinates so that the comparison is relative the same origin.
    const relativeRect = {...XY.sub(rect, state), w: rect.w, h: rect.h}
    const {collisions} = Image.cel(state, atlas)
    return collisions.find(val => Rect.intersects(val, relativeRect))
  }
}
