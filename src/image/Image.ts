import {AtlasID} from '../atlas/AtlasID'
import {Animator, Atlas} from 'aseprite-atlas'
import {DecamillipixelIntXY, XY} from '../math/XY'
import {Layer} from './Layer'
import {Rect} from '../math/Rect'
import {AlphaComposition} from './AlphaComposition'

/** A mapping from a source atlas subtexture to a target. The target region
    is used for rendering. The image may be animated. Each Cel has the same
    size. Specifying a different target width or height than the source
    truncates or repeats the scaled rendered source. Images do not affect
    collision tests but their bounds may be used. */
export class Image {
  private readonly _id: AtlasID
  /** If different than id, use id for masking and imageID for coloring. See
      AlphaComposition. */
  private _imageID: AtlasID
  /** Specified in fractional pixel level coordinates. Includes scaling.

      Images.bounds are used to determine when the image is on screen and
      therefor should be drawn, as well as for rendering itself.

      Images.bounds are used for some collision tests (see CollisionPredicate)
      as entity bounds are calculated in part by Image.bounds, ImageRect.bounds,
      and Entity.bounds. */
  private readonly _bounds: Rect
  private _layer: Layer
  private readonly _animator: Animator
  /** See bounds. */
  private readonly _scale: XY
  /** Specifies the initial marquee offset. */
  private readonly _wrap: DecamillipixelIntXY
  /** Specifies the additional marquee offset added by the shader according to
      the game clock. */
  private readonly _wrapVelocity: DecamillipixelIntXY
  private readonly _alphaComposition: AlphaComposition

  constructor({
    id,
    imageID = id,
    bounds = Rect.make(0, 0, 0, 0),
    layer = Layer.DEFAULT,
    animator = {period: 0, exposure: 0},
    scale = new XY(1, 1),
    wrap = new XY(0, 0),
    wrapVelocity = new XY(0, 0),
    alphaComposition = AlphaComposition.IMAGE
  }: Image.Props) {
    this._id = id
    this._imageID = imageID
    this._bounds = bounds
    this._layer = layer
    this._animator = animator
    this._scale = scale
    this._wrap = wrap
    this._wrapVelocity = wrapVelocity
    this._alphaComposition = alphaComposition
  }

  get id(): AtlasID {
    return this._id
  }
  get imageID(): AtlasID {
    return this._imageID
  }
  set imageID(id: AtlasID) {
    this._imageID = id
  }
  get bounds(): Rect {
    return this._bounds
  }
  get layer(): Layer {
    return this._layer
  }
  get animator(): Animator {
    return this._animator
  }
  get scale(): XY {
    return this._scale
  }
  get wrap(): DecamillipixelIntXY {
    return this._wrap
  }
  get wrapVelocity(): DecamillipixelIntXY {
    return this._wrapVelocity
  }
  get alphaComposition(): AlphaComposition {
    return this._alphaComposition
  }

  /** Translate by. */
  moveBy(by: Readonly<XY>): void {
    this.bounds.position.x += by.x
    this.bounds.position.y += by.y
  }

  /** Set absolute scale. */
  scaleTo(to: Readonly<XY>): void {
    this.bounds.size.w *= Math.abs(to.x / this.scale.x)
    this.bounds.size.h *= Math.abs(to.y / this.scale.y)
    this.scale.x = to.x
    this.scale.y = to.y
  }

  /** Multiply by scale. */
  scaleBy(by: Readonly<XY>): void {
    by = new XY(by.x * this.scale.x, by.y * this.scale.y)
    this.scaleTo(by)
  }

  /** For sorting by draw order. E.g., `images.sort(Image.compare)`. See
      Layer. */
  compareElevation(image: Readonly<Image>): number {
    return (
      this.layer - image.layer ||
      this.bounds.position.y +
        this.bounds.size.h -
        (image.bounds.position.y + image.bounds.size.h)
    )
  }

  animate(time: Milliseconds, atlas: Atlas): void {
    const animator = Animator.animate(
      this.animator.period,
      this.animator.exposure + time,
      atlas.animations[this.id]
    )
    this.animator.period = animator.period
    this.animator.exposure = animator.exposure
  }

  /** Raise or lower by offset. */
  elevate(offset: Layer): void {
    this._layer += offset
  }
}

export namespace Image {
  export interface Props {
    readonly id: AtlasID
    readonly imageID?: AtlasID
    readonly bounds?: Rect
    readonly layer?: Layer
    readonly animator?: Animator
    readonly scale?: XY
    readonly wrap?: DecamillipixelIntXY
    readonly wrapVelocity?: DecamillipixelIntXY
    readonly alphaComposition?: AlphaComposition
  }
}
