import {Image} from './image'
import {Rect} from '../math/rect'
import {XY} from '../math/xy'
import {RectArray} from '../math/rect-array'

export interface ImageRect {
  /** The upper-left and size of the local coordinate system. The images are
      moved relative this position. */
  // [todo]: it is currently not possible to specify images relative an origin. everything assumes upper left so you have to move destination to  cursor knowing to offset by -1, -1.
  readonly bounds: Writable<Rect>
  readonly flip: Writable<XY>
  /** Image coordinates are not relative the bounds origin, they're in level
      coordinates. */
  readonly images: Image[]
}

export namespace ImageRect {
  export function add(rect: ImageRect, image: Image): void {
    rect.images.push(image)
    const union = RectArray.union(rect.images.map(image => image.bounds))
    if (union) {
      rect.bounds.x = union.x
      rect.bounds.y = union.y
      rect.bounds.w = union.w
      rect.bounds.h = union.h
    }
  }
  export function moveTo(rect: ImageRect, to: XY): void {
    moveBy(rect, XY.sub(to, rect.bounds))
  }

  export function moveBy(rect: ImageRect, by: XY): void {
    if (!by.x && !by.y) return
    rect.bounds.x += by.x
    rect.bounds.y += by.y
    rect.images.forEach(image => Image.moveBy(image, by))
  }

  export function setFlip(rect: ImageRect, flip: XY): void {
    const flipX = rect.flip.x !== Math.sign(flip.x)
    const flipY = rect.flip.y !== Math.sign(flip.y)
    if (!flipX && !flipY) return
    rect.flip.x = Math.sign(flip.x)
    rect.flip.y = Math.sign(flip.y)
    rect.images.forEach(image =>
      Image.scale(image, {x: flipX ? -1 : 1, y: flipY ? -1 : 1})
    )
  }

  export function setScale(rect: ImageRect, scale: XY): void {
    // [todo] if needed, scale can be cached in ImageRect. Figure out how to remove flip overlap.
    rect.images.forEach(image => Image.setScale(image, scale))
    const union = RectArray.union(rect.images.map(image => image.bounds))
    if (union) {
      rect.bounds.x = union.x
      rect.bounds.y = union.y
      rect.bounds.w = union.w
      rect.bounds.h = union.h
    }
  }

  export function scale(rect: ImageRect, scale: XY): void {
    rect.images.forEach(image => Image.scale(image, scale))
    const union = RectArray.union(rect.images.map(image => image.bounds))
    if (union) {
      rect.bounds.x = union.x
      rect.bounds.y = union.y
      rect.bounds.w = union.w
      rect.bounds.h = union.h
    }
  }
}
