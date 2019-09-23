import {Image} from '../image/Image'
import {Rect} from '../../math/rect/Rect'
import {XY} from '../../math/xy/XY'
import {Layer} from '../layer/layer'

export interface ImageRect {
  /** The upper-left and size of the local coordinate system. The images are
      moved relative this position. */
  readonly bounds: Rect
  /** For images that require a center offset, an origin may be specified and
      referenced manually in translation calculations. */
  readonly origin: XY
  /** Collision bodies are not scaled. Image.bounds includes scaling so
      ImageRect.bounds does as well. flipImages only controls whether each image
      in the ImageRect is flipped or not. The original orientation is considered
      so a flipped entity composed of a mishmash of flipped images will mirror
      that mishmash and not lose each individual's image's relative flip. */
  readonly scale: XY
  /** Image coordinates are not relative the bounds origin, they're in level
      coordinates. These should usually only be passed statically by the entity
      configuration JSON. If additional imagery is needed, it is often best to
      add a child Entity instead. */
  readonly images: Image[]
}

export namespace ImageRect {
  export function add(rect: ImageRect, image: Image): void {
    rect.images.push(image)
    const union = Rect.unionAll(rect.images.map(image => image.bounds))
    if (union) {
      rect.bounds.position.x = union.position.x
      rect.bounds.position.y = union.position.y
      rect.bounds.size.w = union.size.w
      rect.bounds.size.h = union.size.h
    }
  }
  export function moveTo(rect: ImageRect, to: Readonly<XY>): void {
    moveBy(rect, XY.sub(to, rect.bounds.position))
  }

  export function moveBy(rect: ImageRect, by: Readonly<XY>): void {
    if (!by.x && !by.y) return
    rect.bounds.position.x += by.x
    rect.bounds.position.y += by.y
    rect.images.forEach(image => Image.moveBy(image, by))
  }

  export function setScale(rect: ImageRect, scale: Readonly<XY>): void {
    if (XY.equal(rect.scale, scale)) return
    rect.images.forEach(image => Image.scale(image, XY.div(scale, rect.scale)))
    rect.scale.x = scale.x
    rect.scale.y = scale.y
    const union = Rect.unionAll(rect.images.map(image => image.bounds))
    if (union) {
      rect.bounds.position.x = union.position.x
      rect.bounds.position.y = union.position.y
      rect.bounds.size.w = union.size.w
      rect.bounds.size.h = union.size.h
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
