import {AnimationID} from './animation-id'
import * as Animator from './animator'
import {State as Atlas, Cel} from './atlas'
import {Layer} from './layer'
import * as Rect from '../math/rect'

declare global {
  /** A mapping from a source atlas subtexture to a position. The target region
      is used for rendering and collision detection. The image may be animated.
      Per Atlas.Animation, each Cel has the same size. */
  interface Image {
    id: AnimationID
    x: number
    y: number
    layer: keyof typeof Layer
    animator: Animator.State // todo: move out. Size can be determined without animation.
  }
}

export class Options {
  readonly x?: number
  readonly y?: number
  readonly layer?: keyof typeof Layer
  readonly period?: number
  readonly exposure?: number
}

export function make(
  id: AnimationID,
  {layer = 'DEFAULT', x = 0, y = 0, period = 0, exposure = 0}: Options = {}
): Image {
  return {id, x, y, layer, animator: {period, exposure}}
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
  const exposure = state.animator.exposure + time
  state.animator = Animator.animate(animation, state.animator.period, exposure)
  return state
}

export function source(state: Readonly<Image>, atlas: Atlas): Cel {
  const {cels} = atlas[state.id]
  return cels[Animator.index(cels, state.animator.period)]
}

export function target(
  atlas: Atlas,
  ...images: readonly Readonly<Image>[]
): Rect {
  return images
    .map(({x, y, id}) => ({x, y, w: atlas[id].w, h: atlas[id].h}))
    .reduce(Rect.union)
}
