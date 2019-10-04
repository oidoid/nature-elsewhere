import {AtlasID} from '../atlas/AtlasID'
import {Animator, Atlas} from 'aseprite-atlas'
import {DecamillipixelIntXY, XY} from '../math/XY'
import {Layer} from './Layer'
import {Rect, ReadonlyRect} from '../math/Rect'
import {AlphaComposition} from './AlphaComposition'
import {WH} from '../math/WH'

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

  constructor(atlas: Atlas, props: Image.Props) {
    const position = props.position || new XY(0, 0)
    const size = props.size
      ? props.size
      : defaultSize(props.size, props.scale, props.id, atlas)
    this._id = props.id
    this._imageID = props.imageID || props.id
    this._bounds = {position, size}
    this._layer = props.layer === undefined ? Layer.DEFAULT : props.layer
    this._animator = props.animator || {period: 0, exposure: 0}
    this._scale = props.scale || new XY(1, 1)
    this._wrap = props.wrap || new XY(0, 0)
    this._wrapVelocity = props.wrapVelocity || new XY(0, 0)
    this._alphaComposition = props.alphaComposition || AlphaComposition.IMAGE
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

  get bounds(): ReadonlyRect {
    return this._bounds
  }

  get layer(): Layer {
    return this._layer
  }

  get animator(): Readonly<Animator> {
    return this._animator
  }

  get scale(): Readonly<XY> {
    return this._scale
  }

  get wrap(): Readonly<DecamillipixelIntXY> {
    return this._wrap
  }

  get wrapVelocity(): Readonly<DecamillipixelIntXY> {
    return this._wrapVelocity
  }

  get alphaComposition(): AlphaComposition {
    return this._alphaComposition
  }

  /** Translate by. */
  moveBy(by: Readonly<XY>): void {
    this._bounds.position.x += by.x
    this._bounds.position.y += by.y
  }

  moveTo(to: Readonly<XY>): void {
    this._bounds.position.x = to.x
    this._bounds.position.y = to.y
  }

  sizeTo(to: Readonly<WH>): void {
    this._bounds.size.w = to.w * Math.abs(this.scale.x)
    this._bounds.size.h = to.h * Math.abs(this.scale.y)
  }

  /** Set absolute scale. */
  scaleTo(to: Readonly<XY>): void {
    this._bounds.size.w *= Math.abs(to.x / this.scale.x)
    this._bounds.size.h *= Math.abs(to.y / this.scale.y)
    this._scale.x = to.x
    this._scale.y = to.y
  }

  /** Multiply by scale. */
  scaleBy(by: Readonly<XY>): void {
    this._bounds.size.w *= Math.abs(by.x)
    this._bounds.size.h *= Math.abs(by.y)
    this._scale.x *= by.x
    this._scale.y *= by.y
  }

  wrapTo(to: Readonly<XY>): void {
    this._wrap.x = to.x
    this._wrap.y = to.y
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
    this._animator.period = animator.period
    this._animator.exposure = animator.exposure
  }

  resetAnimation(): void {
    this._animator.period = 0
    this._animator.exposure = 0
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
    readonly position?: XY
    readonly size?: WH
    readonly layer?: Layer
    readonly animator?: Animator
    readonly scale?: XY
    readonly wrap?: DecamillipixelIntXY
    readonly wrapVelocity?: DecamillipixelIntXY
    readonly alphaComposition?: AlphaComposition
  }
}

function defaultSize(
  size: Maybe<Readonly<WH>>,
  scale: Maybe<Readonly<XY>>,
  id: AtlasID,
  atlas: Atlas
): WH {
  const w = size
    ? size.w
    : Math.abs(scale && scale.x !== undefined ? scale.x : 1) *
      atlas.animations[id].size.w
  const h = size
    ? size.h
    : Math.abs(scale && scale.y !== undefined ? scale.y : 1) *
      atlas.animations[id].size.h
  return new WH(w, h)
}
