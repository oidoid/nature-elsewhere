import {Image} from './image'
import {Rect} from '../math/rect'
import {RectArray} from '../math/rect-array'
import {XY} from '../math/xy'

/** The upper-left of the rectangle describing the union of images in level
    coordinates. */
export interface ImageRect extends Mutable<Rect> {
  /** Image coordinates are not relative origin. */
  readonly images: readonly Image[]
}
type t = ImageRect

export namespace ImageRect {
  export const invalidate = (val: t): void => {
    const union = RectArray.union(val.images)
    if (union) ({w: val.w, h: val.h} = union)
  }

  export const moveTo = (val: t, to: XY): t =>
    moveBy(val, {x: to.x - val.x, y: to.y - val.y})

  export const moveBy = (val: t, by: XY): t => {
    if (!by.x && !by.y) return val
    val.images.forEach(val => Image.moveBy(val, by))
    return {
      ...Rect.add(val, {x: by.x, y: by.y, w: 0, h: 0}),
      images: val.images
    }
  }
}
