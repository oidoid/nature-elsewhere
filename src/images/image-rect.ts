import {Atlas} from '../atlas/atlas'
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
    ...images: readonly Image[]
  ): ImageRect {
    if (XY.equal(state, xy)) return {...state, images}
    return moveBy(state, XY.sub(xy, state), ...images)
  }

  export function moveBy(
    state: Rect,
    {x, y}: XY,
    ...images: readonly Mutable<Image>[]
  ): ImageRect {
    images.forEach(img => ((img.x += x), (img.y += y)))
    return {...Rect.add(state, {x, y, w: 0, h: 0}), images}
  }

  export const collides = (
    lhs: ImageRect,
    rhs: ImageRect,
    atlas: Atlas,
    {x, y}: XY // Overrides lhs.xy
  ): Image | undefined => {
    if (!Rect.intersects({x, y, w: lhs.w, h: lhs.h}, rhs)) return
    return rhs.images.find(img => collidesImage(lhs, img, atlas, {x, y}))
  }

  export const collidesImage = (
    {images, w, h}: ImageRect,
    img: Image,
    atlas: Atlas,
    {x, y}: XY // Overrides ImageRect.xy
  ): Image | undefined => {
    if (!Rect.intersects({x, y, w, h}, img)) return
    return images.find(lhs => Image.collides(lhs, img, atlas, {x, y}))
  }
}
