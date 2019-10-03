import {Image} from '../image/Image'
import {Rect, ReadonlyRect} from '../math/Rect'
import {XY} from '../math/XY'
import {Layer} from '../image/Layer'
import {UpdateStatus} from '../entities/updaters/updateStatus/UpdateStatus'
import {AtlasID} from '../atlas/AtlasID'
import {WH} from '../math/WH'

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
      that mishmash and not lose each individual's image's relative flip.

      Always use non-zero scaling so that Entity can determine relative scaling
      of collision bodies. */
  readonly scale: XY
  /** Image coordinates are not relative the bounds origin, they're in level
      coordinates. These should usually only be passed statically by the entity
      configuration JSON. If additional imagery is needed, it is often best to
      add a child Entity instead. */
  readonly images: Image[]

  imageID?: AtlasID
}

export namespace ImageRect {
  export function make(scale: XY = new XY(1, 1)): ImageRect {
    return {
      origin: new XY(0, 0),
      bounds: {position: new XY(0, 0), size: new WH(0, 0)},
      scale,
      images: []
    }
  }

  export function setImageID(rect: ImageRect, id: AtlasID): UpdateStatus {
    if (rect.imageID === id) return UpdateStatus.UNCHANGED
    rect.imageID = id
    for (const image of rect.images) image.imageID = id
    return UpdateStatus.UPDATED
  }

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
  export function moveTo(rect: ImageRect, to: Readonly<XY>): UpdateStatus {
    return moveBy(rect, to.sub(rect.bounds.position))
  }

  export function moveBy(rect: ImageRect, by: Readonly<XY>): UpdateStatus {
    if (!by.x && !by.y) return UpdateStatus.UNCHANGED
    rect.bounds.position.x += by.x
    rect.bounds.position.y += by.y
    for (const image of rect.images) image.moveBy(by)
    return UpdateStatus.UPDATED
  }

  export function scaleTo(rect: ImageRect, scale: Readonly<XY>): UpdateStatus {
    if (rect.scale.equal(scale)) return UpdateStatus.UNCHANGED
    for (const image of rect.images) image.scaleBy(scale.div(rect.scale))
    rect.scale.x = scale.x
    rect.scale.y = scale.y
    const union = Rect.unionAll(rect.images.map(image => image.bounds))
    if (union) {
      rect.bounds.position.x = union.position.x
      rect.bounds.position.y = union.position.y
      rect.bounds.size.w = union.size.w
      rect.bounds.size.h = union.size.h
    }
    return UpdateStatus.UPDATED
  }

  export function scaleBy(rect: ImageRect, scale: Readonly<XY>): void {
    scaleTo(rect, scale.mul(rect.scale))
  }

  export function elevate(
    rect: ImageRect | readonly Image[],
    offset: Layer
  ): void {
    const images = 'images' in rect ? rect.images : rect
    for (const image of images) image.elevate(offset)
  }

  export function intersects(
    rect: Readonly<ImageRect>,
    bounds: ReadonlyRect
  ): readonly Image[] {
    return rect.images.filter(image => Rect.intersects(bounds, image.bounds))
  }
}
