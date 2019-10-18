import {Assert} from '../utils/Assert'
import {AtlasID} from '../atlas/AtlasID'
import {Image} from '../image/Image'
import {Layer} from '../image/Layer'
import {Rect, ReadonlyRect} from '../math/Rect'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {XY} from '../math/XY'

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
      coordinates. These should usually only be passed statically by the entity.
      If additional imagery is needed, it is often best to add a child Entity
      instead. */
  private readonly _images: Image[]

  /** If set, the imageID for all images. See Image._imageID. */
  private _imageID?: AtlasID

  constructor(props: ImageRect.Props = {}) {
    this._origin = props.origin ?? new XY(0, 0)
    this._bounds = Rect.make(0, 0, 0, 0)
    this._scale = new XY(1, 1)
    this._images = props.images ?? []
    this._imageID = props.imageID
    this.invalidate()
    if (props.position) this.moveBy(props.position)
    if (props.scale) {
      Assert.assert(
        props.scale.x && props.scale.y,
        `Scale must be nonzero (x=${props.scale.x}, y=${props.scale.y}).`
      )
      this.scaleBy(props.scale)
    }
  }

  get bounds(): ReadonlyRect {
    return this._bounds
  }

  /** See ImageRect._origin. */
  get origin(): Readonly<XY> {
    return this._origin
  }

  get scale(): Readonly<XY> {
    return this._scale
  }

  get images(): readonly Readonly<Image>[] {
    return this._images
  }

  get imageID(): Maybe<AtlasID> {
    return this._imageID
  }

  setImageID(id?: AtlasID): UpdateStatus {
    if (this.imageID === id) return UpdateStatus.UNCHANGED
    this._imageID = id
    for (const image of this._images) image.imageID = id ?? image.id
    return UpdateStatus.UPDATED
  }

  add(...images: readonly Image[]): void {
    this._images.push(...images)
    this.invalidate()
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
    this._bounds.position.x += by.x
    this._bounds.position.y += by.y
    for (const image of this.images) image.moveBy(by)
    return UpdateStatus.UPDATED
  }

  scaleTo(to: Readonly<XY>): UpdateStatus {
    Assert.assert(to.x && to.y, `Scale must be nonzero (x=${to.x}, y=${to.y}).`)
    if (this.scale.equal(to)) return UpdateStatus.UNCHANGED
    for (const image of this.images) image.scaleBy(to.div(this.scale))
    this._scale.x = to.x
    this._scale.y = to.y
    this.invalidate()
    return UpdateStatus.UPDATED
  }

  scaleBy(scale: Readonly<XY>): void {
    this.scaleTo(scale.mul(this.scale))
  }

  elevate(offset: Layer): void {
    for (const image of this.images) image.elevate(offset)
  }

  intersects(bounds: ReadonlyRect): Readonly<Image>[] {
    return this.images.filter(image => Rect.intersects(bounds, image.bounds))
  }

  invalidate(): void {
    const union = Rect.unionAll(this.images.map(image => image.bounds))
    if (!union) return
    this._bounds.position.x = union.position.x
    this._bounds.position.y = union.position.y
    this._bounds.size.w = union.size.w
    this._bounds.size.h = union.size.h
  }
}

export namespace ImageRect {
  export interface Props {
    readonly origin?: XY
    readonly position?: XY
    readonly scale?: XY
    readonly images?: Image[]
    readonly imageID?: AtlasID
  }
}
