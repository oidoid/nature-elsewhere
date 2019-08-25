import {Image} from './image'
import {Rect} from '../math/rect'
import {XY} from '../math/xy'

/** The upper-left of the rectangle describing the union of images in level
    coordinates. */
export interface ImageRect extends Rect {
  /** Image coordinates are not relative origin. */
  readonly images: readonly Image[]
}

export namespace ImageRect {
  export function moveTo(
    state: Rect,
    xy: XY,
    sx: number,
    ...images: readonly Image[]
  ): ImageRect {
    if (XY.equal(state, xy)) return {...state, images}
    return moveBy(state, XY.sub(xy, state), sx, ...images)
  }

  export function moveBy(
    state: Rect,
    {x, y}: XY,
    sx: number,
    ...images: readonly Mutable<Image>[]
  ): ImageRect {
    images.forEach(img => ((img.x += x), (img.y += y), (img.sx = sx)))
    return {...Rect.add(state, {x, y, w: 0, h: 0}), images}
  }

  export function centerOn(
    state: Rect,
    rect: Rect,
    ...images: readonly Image[]
  ): ImageRect {
    const x = Math.trunc(rect.x + rect.w / 2) - Math.trunc(state.w / 2)
    const y = Math.trunc(rect.y + rect.h / 2) - Math.trunc(state.h / 2)
    return moveTo(state, {x, y}, 1, ...images)
  }
}
