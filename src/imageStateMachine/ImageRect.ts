import {Image} from '../image/Image'
import {Rect, ReadonlyRect} from '../math/Rect'
import {XY} from '../math/XY'
import {Layer} from '../image/Layer'
import {UpdateStatus} from '../entities/updaters/updateStatus/UpdateStatus'
import {AtlasID} from '../atlas/AtlasID'

export class ImageRect {
  /** The upper-left and size of the local coordinate system. The images are
      moved relative this position. */
  private readonly _bounds: Rect
  /** For images that require a center offset, an origin may be specified and
      referenced manually in translation calculations. */
  private readonly _origin: XY
  /** Collision bodies are not scaled. Image.bounds includes scaling so
      ImageRect.bounds does as well. flipImages only controls whether each image
      in the ImageRect is flipped or not. The original orientation is considered
      so a flipped entity composed of a mishmash of flipped images will mirror
      that mishmash and not lose each individual's image's relative flip.

      Always use non-zero scaling so that Entity can determine relative scaling
      of collision bodies. */
  private readonly _scale: XY
  /** Image coordinates are not relative the bounds origin, they're in level
      coordinates. These should usually only be passed statically by the entity
      configuration JSON. If additional imagery is needed, it is often best to
      add a child Entity instead. */
  private readonly _images: Image[]

  /** If set, the imageID for all images. See Image._imageID. */
  private _imageID?: AtlasID

  constructor({
    origin = new XY(0, 0),
    bounds = Rect.make(0, 0, 0, 0),
    scale = new XY(1, 1),
    images = [],
    imageID
  }: ImageRect.Props = {}) {
    this._origin = origin
    this._bounds = bounds
    this._scale = scale
    this._images = images
    this._imageID = imageID
  }

  get bounds(): Rect {
    return this._bounds
  }

  get origin(): XY {
    return this._origin
  }

  get scale(): XY {
    return this._scale
  }

  get images(): readonly Image[] {
    return this._images
  }

  get imageID(): Maybe<AtlasID> {
    return this._imageID
  }

  setImageID(id: AtlasID): UpdateStatus {
    if (this.imageID === id) return UpdateStatus.UNCHANGED
    this._imageID = id
    for (const image of this.images) image.imageID = id
    return UpdateStatus.UPDATED
  }

  add(...images: readonly Image[]): void {
    this._images.push(...images)
    const union = Rect.unionAll(this.images.map(image => image.bounds))
    if (union) {
      this.bounds.position.x = union.position.x
      this.bounds.position.y = union.position.y
      this.bounds.size.w = union.size.w
      this.bounds.size.h = union.size.h
    }
  }

  replace(...images: readonly Image[]): void {
    this._images.length = 0
    this.add(...images)
  }

  moveTo(to: Readonly<XY>): UpdateStatus {
    return this.moveBy(to.sub(this.bounds.position))
  }

  moveBy(by: Readonly<XY>): UpdateStatus {
    if (!by.x && !by.y) return UpdateStatus.UNCHANGED
    this.bounds.position.x += by.x
    this.bounds.position.y += by.y
    for (const image of this.images) image.moveBy(by)
    return UpdateStatus.UPDATED
  }

  scaleTo(scale: Readonly<XY>): UpdateStatus {
    if (this.scale.equal(scale)) return UpdateStatus.UNCHANGED
    for (const image of this.images) image.scaleBy(scale.div(this.scale))
    this.scale.x = scale.x
    this.scale.y = scale.y
    const union = Rect.unionAll(this.images.map(image => image.bounds))
    if (union) {
      this.bounds.position.x = union.position.x
      this.bounds.position.y = union.position.y
      this.bounds.size.w = union.size.w
      this.bounds.size.h = union.size.h
    }
    return UpdateStatus.UPDATED
  }

  scaleBy(scale: Readonly<XY>): void {
    this.scaleTo(scale.mul(this.scale))
  }

  elevate(offset: Layer): void {
    for (const image of this.images) image.elevate(offset)
  }

  intersects(bounds: ReadonlyRect): readonly Image[] {
    return this.images.filter(image => Rect.intersects(bounds, image.bounds))
  }
}

export namespace ImageRect {
  export interface Props {
    readonly origin?: XY
    readonly bounds?: Rect
    readonly scale?: XY
    readonly images?: Image[]
    readonly imageID?: AtlasID
  }
}
