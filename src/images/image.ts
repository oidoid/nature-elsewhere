import * as Animator from './animator'
import {State as Atlas, Cel} from '../atlas/atlas'
import {Layer} from './layer'
import * as Rect from '../math/rect'

declare global {
  /** A mapping from a source atlas subtexture to a position. The target region
      is used for rendering and collision detection. The image may be animated.
      Per Atlas.Animation, each Cel has the same size. */
  interface Image extends Mutable<XY>, Mutable<Animator.State> {
    id: string
    layer: keyof typeof Layer
  }
}

export interface Options extends Partial<XY>, Partial<Animator.State> {
  readonly layer?: keyof typeof Layer
}

export function make(
  id: string,
  {layer = 'DEFAULT', x = 0, y = 0, period = 0, exposure = 0}: Options = {}
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

export function source(state: Readonly<Image>, atlas: Atlas): Cel {
  const {cels} = atlas[state.id]
  return cels[Animator.index(cels, state.period)]
}

export function target(
  atlas: Atlas,
  ...images: readonly Readonly<Image>[]
): Rect {
  return images
    .map(({x, y, id}) => ({x, y, w: atlas[id].w, h: atlas[id].h}))
    .reduce(Rect.union)
}
