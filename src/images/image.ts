import {Animator} from './animator'
import {Atlas} from '../atlas/atlas'
import {Layer} from './layer'
import {XY} from '../math/xy'
import {WH} from '../math/wh'

/** A mapping from a source atlas subtexture to a target. The target region
    is used for rendering. The image may be animated. Each Cel has the same
    size. Specifying a different target width or height than the source
    truncates or repeats the scaled rendered source.
    Bounds (x, y, w, and h members) are the union of all Entity images. This is
    used for quick collision detections such checking if the Entity is on
    screen. x and y are in in level coordinates. */
export interface Image extends Mutable<XY>, WH, Animator {
  readonly id: string
  readonly scale: XY
  readonly layer: Layer.Key
  readonly tx: number
  readonly ty: number
  readonly tvx: number
  readonly tvy: number
}
type t = Image

export namespace Image {
  export const moveBy = (val: t, {x, y}: XY): void => {
    ;(val.x += x), (val.y += y)
  }

  /** For sorting by draw order. E.g., `images.sort(Image.compare)`. */
  export const compare = (lhs: t, rhs: t): number =>
    Layer[lhs.layer] - Layer[rhs.layer] || lhs.y + lhs.h - (rhs.y + rhs.h)

  export const animate = (val: t, atlas: Atlas, time: number): void => {
    const exposure = val.exposure + time
    const animator = Animator.animate(atlas[val.id], val.period, exposure)
    Object.assign(val, animator)
  }

  export const cel = ({id, period}: t, atlas: Atlas): Atlas.Cel =>
    atlas[id].cels[Animator.index(atlas[id].cels, period)]
}
