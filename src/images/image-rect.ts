import {Image} from './image'
import {Rect} from '../math/rect'
import {XY} from '../math/xy'

/** The upper-left of the rectangle describing the union of images in level
    coordinates. */
export interface ImageRect extends XY {
  /** Image coordinates are not relative origin. */
  readonly images: readonly Image[]
}

export namespace ImageRect {
  export function moveTo(
    origin: XY,
    xy: XY,
    ...images: readonly Image[]
  ): ImageRect {
    if (XY.equal(origin, xy)) return {...origin, images}
    return moveBy(origin, XY.sub(xy, origin), ...images)
  }

  export function moveBy(
    origin: XY,
    {x, y}: XY,
    ...images: readonly Mutable<Image>[]
  ): ImageRect {
    images.forEach(img => ((img.x += x), (img.y += y)))
    return {...XY.add(origin, {x, y}), images}
  }

  export function centerOn(
    bounds: Rect,
    rect: Rect,
    ...images: readonly Image[]
  ): ImageRect {
    const x = Math.trunc(rect.x + rect.w / 2) - Math.trunc(bounds.w / 2)
    const y = Math.trunc(rect.y + rect.h / 2) - Math.trunc(bounds.h / 2)
    return moveTo(bounds, {x, y}, ...images)
  }
}
