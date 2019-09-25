import {Image} from '../image/Image'
import {Rect} from '../../math/rect/Rect'
import {XY} from '../../math/xy/XY'
import {Layer} from '../layer/Layer'
import {UpdateStatus} from '../../entities/updaters/updateStatus/UpdateStatus'
import {AtlasID} from '../../atlas/atlasID/AtlasID'

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

  imageID?: AtlasID
}

export namespace ImageRect {
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
    return moveBy(rect, XY.sub(to, rect.bounds.position))
  }

  export function moveBy(rect: ImageRect, by: Readonly<XY>): UpdateStatus {
    if (!by.x && !by.y) return UpdateStatus.UNCHANGED
    rect.bounds.position.x += by.x
    rect.bounds.position.y += by.y
    for (const image of rect.images) Image.moveBy(image, by)
    return UpdateStatus.UPDATED
  }

  export function setScale(rect: ImageRect, scale: Readonly<XY>): UpdateStatus {
    if (XY.equal(rect.scale, scale)) return UpdateStatus.UNCHANGED
    for (const image of rect.images)
      Image.scale(image, XY.div(scale, rect.scale))
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

  export function scale(rect: ImageRect, scale: XY): void {
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
