import {Image} from '../image/image'
import {Rect} from '../../math/rect/rect'
import {XY} from '../../math/xy/xy'
import {RectArray} from '../../math/rect-array/rect-array'

export interface ImageRect {
  /** The upper-left and size of the local coordinate system. The images are
      moved relative this position. */
  readonly bounds: Writable<Rect>
  readonly scale: Writable<XY>
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

  export function setScale(rect: ImageRect, scale: XY): void {
    if (XY.equal(rect.scale, scale)) return
    rect.images.forEach(image => Image.scale(image, XY.div(scale, rect.scale)))
    rect.scale.x = scale.x
    rect.scale.y = scale.y
    const union = RectArray.union(rect.images.map(image => image.bounds))
    if (union) {
      rect.bounds.x = union.x
      rect.bounds.y = union.y
      rect.bounds.w = union.w
      rect.bounds.h = union.h
    }
  }

  export function scale(rect: ImageRect, scale: XY): void {
    scale = {x: rect.scale.x * scale.x, y: rect.scale.y * scale.y}
    ImageRect.setScale(rect, XY.mul(scale, rect.scale))
  }
}
