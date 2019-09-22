import {Image} from '../image/Image'
import {Rect} from '../../math/rect/Rect'
import {XY} from '../../math/xy/XY'
import {Layer} from '../layer/layer'

export interface ImageRect {
  /** The upper-left and size of the local coordinate system. The images are
      moved relative this position. */
  readonly bounds: Writable<Rect>
  /** For images that require a center offset, an origin may be specified and
      referenced manually in translation calculations. */
  readonly origin: Writable<XY>
  /** Collision bodies are not scaled. Image.bounds includes scaling so
      ImageRect.bounds does as well. flipImages only controls whether each image
      in the ImageRect is flipped or not. The original orientation is considered
      so a flipped entity composed of a mishmash of flipped images will mirror
      that mishmash and not lose each individual's image's relative flip. */
  readonly scale: Writable<XY>
  /** Image coordinates are not relative the bounds origin, they're in level
      coordinates. */
  readonly images: Image[]
}

export namespace ImageRect {
  export function add(rect: ImageRect, image: Image): void {
    rect.images.push(image)
    const union = Rect.unionAll(rect.images.map(image => image.bounds))
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
    const union = Rect.unionAll(rect.images.map(image => image.bounds))
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

  export function elevate(
    rect: ImageRect | readonly Image[],
    offset: Layer
  ): void {
    const images = 'images' in rect ? rect.images : rect
    for (const image of images) Image.elevate(image, offset)
  }

  export function intersects(
    rect: Readonly<ImageRect>,
    bounds: Rect
  ): readonly Image[] {
    return rect.images.filter(image => Rect.intersects(bounds, image.bounds))
  }
}
