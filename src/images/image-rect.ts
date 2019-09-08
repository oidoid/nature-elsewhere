import {Image} from './image'
import {Rect} from '../math/rect'
import {XY} from '../math/xy'

/** The upper-left of the rectangle describing the union of images in level
    coordinates. */
export interface ImageRect extends Rect {
  /** Image coordinates are not relative origin. */
  readonly images: readonly Image[]
}
type t = ImageRect

export namespace ImageRect {
  export const moveTo = (val: t, to: XY): t =>
    moveBy(val, {x: to.x - val.x, y: to.y - val.y})

  export const moveBy = (val: Mutable<t>, {x, y}: XY): t => {
    if (!x && !y) return val
    val.images.forEach((img: Mutable<Image>) => ((img.x += x), (img.y += y)))
    return {...Rect.add(val, {x, y, w: 0, h: 0}), images: val.images}
  }
}
