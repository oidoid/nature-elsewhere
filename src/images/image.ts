import {AnimationID} from './animation-id'
import {Animator} from './animator'
import {Atlas} from '../atlas/atlas'
import {Layer} from './layer'
import {Limits} from '../math/limits'
import {Rect} from '../math/rect'

/** A mapping from a source atlas subtexture to a target. The target region
    is used for rendering and collision detection. The image may be animated.
    Each Cel has the same size. */
export interface Image extends Rect, Animator {
  readonly id: AnimationID.Key
  readonly layer: Layer.Key
}

export namespace Image {
  /** Specifying a different width or height scales the target. */
  export interface Config extends Partial<Rect>, Partial<Animator> {
    readonly layer?: Layer.Key
  }

  export function make(
    atlas: Atlas,
    id: AnimationID.Key,
    {
      layer = 'DEFAULT',
      x = 0,
      y = 0,
      w = atlas[id].w,
      h = atlas[id].h,
      period = 0,
      exposure = 0
    }: Config = {}
  ): Image {
    return {id, x, y, w, h, layer, period, exposure}
  }

  /** For sorting by draw order. E.g., `images.sort(Image.compare)`. */
  export function compare(lhs: Image, rhs: Image): number {
    const layer = Layer[lhs.layer] - Layer[rhs.layer]
    return layer || lhs.y + lhs.h - (rhs.y + rhs.h)
  }

  export function animate(state: Image, atlas: Atlas, time: number): Image {
    const animation = atlas[state.id]
    const exposure = state.exposure + time
    const animator = Animator.animate(animation, state.period, exposure)
    return Object.assign(state, animator)
  }

  export function source({id, period}: Image, atlas: Atlas): Atlas.Cel {
    return atlas[id].cels[Animator.index(atlas[id].cels, period)]
  }

  export function target(...images: readonly Image[]): Rect {
    const rects: readonly Rect[] = images
    return rects.length
      ? rects.reduce(Rect.union)
      : {x: Limits.MIN_SHORT, y: Limits.MIN_SHORT, w: 0, h: 0}
  }
}
