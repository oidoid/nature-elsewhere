import {Animator} from './animator'
import {Atlas} from '../atlas/atlas'
import {ImageConfig} from './image-config'
import * as imageDefaults from '../assets/image.json'
import {Layer} from './layer'
import {Limits} from '../math/limits'
import {Rect} from '../math/rect'

/** A mapping from a source atlas subtexture to a target. The target region
    is used for rendering and collision detection. The image may be animated.
    Each Cel has the same size. */
export interface Image extends Required<ImageConfig> {
  readonly layer: Layer.Key
}

export namespace Image {
  export type Options = ImageConfig & {readonly layer?: Layer.Key}

  export function make(atlas: Atlas, opts: Options): Image {
    if (!(opts.id in atlas))
      throw new Error(`Atlas missing animation "${opts.id}".`)
    const ret = Object.assign({}, imageDefaults, opts)
    const {w, h} = atlas[opts.id]
    return {w: Math.abs(w * ret.sx), h: Math.abs(h * ret.sy), ...ret}
  }

  /** For sorting by draw order. E.g., `images.sort(Image.compare)`. */
  export function compare(lhs: Image, rhs: Image): number {
    const layer = Layer[lhs.layer] - Layer[rhs.layer]
    return layer || lhs.y + lhs.h - (rhs.y + rhs.h)
  }

  export function animate(
    state: Mutable<Image>,
    atlas: Atlas,
    time: number
  ): Image {
    const exposure = state.exposure + time
    const animator = Animator.animate(atlas[state.id], state.period, exposure)
    ;(state.tx += state.tvx * time), (state.ty += state.tvy * time)
    return Object.assign(state, animator)
  }

  export function source({id, period}: Image, atlas: Atlas): Atlas.Cel {
    return atlas[id].cels[Animator.index(atlas[id].cels, period)]
  }

  export function target(...images: readonly Image[]): Rect {
    const rects: readonly Rect[] = images
    const fallback = {x: Limits.MIN_SHORT, y: Limits.MIN_SHORT, w: 0, h: 0}
    return rects.length ? rects.reduce(Rect.union) : fallback
  }
}
