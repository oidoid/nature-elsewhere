import {AnimationID} from './animation-id'
import {Animator} from './animator'
import {Atlas} from '../atlas/atlas'
import {Layer} from './layer'
import {Rect} from '../math/rect'
import {XY} from '../math/xy'

/** A mapping from a source atlas subtexture to a position. The target region
    is used for rendering and collision detection. The image may be animated.
    Per Atlas.Animation, each Cel has the same size. */
export interface Image extends Mutable<XY>, Mutable<Animator> {
  id: keyof typeof AnimationID
  layer: keyof typeof Layer
}

export namespace Image {
  export interface Config extends Partial<XY>, Partial<Animator> {
    readonly layer?: keyof typeof Layer
  }

  export function make(
    id: keyof typeof AnimationID,
    {layer = 'DEFAULT', x = 0, y = 0, period = 0, exposure = 0}: Config = {}
  ): Image {
    return {id, x, y, layer, period, exposure}
  }

  /** For sorting by draw order. E.g.,
    `images.sort((lhs, rhs) => Image.compare(atlas, lhs, rhs))`. */
  export function compare(
    atlas: Atlas,
    lhs: Readonly<Image>,
    rhs: Readonly<Image>
  ): number {
    const layer = Layer[lhs.layer] - Layer[rhs.layer]
    return layer || lhs.y + atlas[lhs.id].h - (rhs.y + atlas[rhs.id].h)
  }

  export function animate(state: Image, atlas: Atlas, time: number): Image {
    const animation = atlas[state.id]
    const exposure = state.exposure + time
    const animator = Animator.animate(animation, state.period, exposure)
    return Object.assign(state, animator)
  }

  export function source(
    {id, period}: Readonly<Image>,
    atlas: Atlas
  ): Atlas.Cel {
    return atlas[id].cels[Animator.index(atlas[id].cels, period)]
  }

  export function target(
    atlas: Atlas,
    ...images: readonly Readonly<Image>[]
  ): Rect {
    return images
      .map(({x, y, id}) => ({x, y, w: atlas[id].w, h: atlas[id].h}))
      .reduce(Rect.union)
  }
}
