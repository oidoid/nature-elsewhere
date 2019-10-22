import {Animator, Atlas, Integer, Milliseconds} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {DecamillipixelXY, XY} from '../math/XY'
import {Layer} from './Layer'
import {ReadonlyRect, Rect} from '../math/Rect'
import {SpriteComposition} from './SpriteComposition'
import {WH} from '../math/WH'

/** A mapping from an immutable source atlas subtexture to a mutable rendered
    destination region. The sprite may be animated. */
export class Sprite {
  /** The atlas subtexture identifier. The identifier should be unique within
      the atlas but may be referenced by multiple sprites. */
  private readonly _id: AtlasID

  /** See SpriteComposition. */
  private _constituentID: AtlasID
  private _composition: SpriteComposition

  /** The position and size of the destination, includes scaling. The width and
      height are unsigned and never negative even when scaling indicates the
      sprite will be flipped when rendered.

      Each animation cel has the same size so an sprite's dimensions only change
      when instructed by the caller. Specifying a different destination width or
      height than the source truncates or repeats the scaled rendered source.

      Sprite.bounds are used to determine when the sprite is on screen and
      therefor should be drawn, as well as for rendering itself.

      Sprite.bounds are used for some collision tests (see CollisionPredicate)
      as entity bounds are calculated in part by Sprite.bounds,
      SpriteRect.bounds, and Entity.bounds. */
  private readonly _bounds: Rect

  /** The drawing layer. A higher number indicates a later draw relative other
      sprites. The effect is that an sprite may be drawn above or below other
      sprites in a controlled manner allowing for effects like shadows to
      consistently be drawn below the object meant to cast it. For objects on
      the same layer, the greater destination position and height is drawn
      last. */
  private _layer: Layer

  private readonly _scale: XY

  private readonly _animator: Animator

  /** Specifies the initial marquee offset. Marquee offsets are all relative
      relative the absolute game time and therefor synchronized by default. */
  private readonly _wrap: DecamillipixelXY

  /** Specifies the additional marquee offset added by the shader according to
      the game clock. */
  private readonly _wrapVelocity: DecamillipixelXY

  /** Optionally, compute the sprite size from the animation source's size and
      the specified scale. */
  static withAtlasSize(atlas: Atlas, props: Sprite.Props): Sprite {
    const animation = atlas.animations[props.id]
    const size =
      props.size ??
      new WH(
        props.w ?? animation.size.w * Math.abs(props.scale?.x ?? props.sx ?? 1),
        props.h ?? animation.size.h * Math.abs(props.scale?.y ?? props.sy ?? 1)
      )
    return new Sprite({...props, size})
  }

  constructor(props: Sprite.Props) {
    this._id = props.id
    this._constituentID = props.constituentID ?? props.id
    this._composition = props.composition ?? SpriteComposition.SOURCE
    this._scale = props.scale ?? new XY(props.sx ?? 1, props.sy ?? 1)
    Sprite.validateScale(this._scale)
    this._bounds = props.bounds ?? {
      position: props.position ?? new XY(props.x ?? 0, props.y ?? 0),
      size: props.size ?? new WH(props.w ?? 0, props.h ?? 0)
    }
    this._layer = props.layer ?? Layer.DEFAULT
    this._animator = props.animator ?? {
      period: props.period ?? 0,
      exposure: props.exposure ?? 0
    }
    this._wrap = props.wrap ?? new XY(props.wx ?? 0, props.wy ?? 0)
    this._wrapVelocity =
      props.wrapVelocity ?? new XY(props.wvx ?? 0, props.wvy ?? 0)
  }

  get id(): AtlasID {
    return this._id
  }

  get constituentID(): AtlasID {
    return this._constituentID
  }

  set constituentID(id: AtlasID) {
    this._constituentID = id
  }

  get composition(): SpriteComposition {
    return this._composition
  }

  set composition(composition: SpriteComposition) {
    this._composition = composition
  }

  get bounds(): ReadonlyRect {
    return this._bounds
  }

  moveBy(by: Readonly<XY>): void {
    this._bounds.position.x += by.x
    this._bounds.position.y += by.y
  }

  moveTo(to: Readonly<XY>): void {
    this._bounds.position.x = to.x
    this._bounds.position.y = to.y
  }

  sizeTo(unscaledTo: Readonly<WH>): void {
    this._bounds.size.w = unscaledTo.w * Math.abs(this.scale.x)
    this._bounds.size.h = unscaledTo.h * Math.abs(this.scale.y)
  }

  get layer(): Layer {
    return this._layer
  }

  set layer(layer: Layer) {
    this._layer = layer
  }

  /** See Sprite.compareElevation(). */
  compareElevation(sprite: Readonly<Sprite>): Integer {
    return Sprite.compareElevation(this, sprite)
  }

  get scale(): Readonly<XY> {
    return this._scale
  }

  /** Set absolute scale. */
  scaleTo(to: Readonly<XY>): void {
    Sprite.validateScale(to)
    this._bounds.size.w *= Math.abs(to.x / this.scale.x)
    this._bounds.size.h *= Math.abs(to.y / this.scale.y)
    this._scale.x = to.x
    this._scale.y = to.y
  }

  /** Multiply by scale. */
  scaleBy(by: Readonly<XY>): void {
    Sprite.validateScale(by)
    this._bounds.size.w *= Math.abs(by.x)
    this._bounds.size.h *= Math.abs(by.y)
    this._scale.x *= by.x
    this._scale.y *= by.y
  }

  get animator(): Readonly<Animator> {
    return this._animator
  }

  animate(atlas: Atlas, time: Milliseconds): void {
    const {period, exposure} = Animator.animate(
      this.animator.period,
      this.animator.exposure + time,
      atlas.animations[this.id]
    )
    this._animator.period = period
    this._animator.exposure = exposure
  }

  resetAnimation(): void {
    this._animator.period = 0
    this._animator.exposure = 0
  }

  animation(atlas: Atlas): Atlas.Animation {
    return atlas.animations[this.id]
  }

  cel(atlas: Atlas): Atlas.Cel {
    return this.animation(atlas).cels[this.celIndex(atlas)]
  }

  bodies(atlas: Atlas): Rect[] {
    return this.cel(atlas).slices.map(({x, y, w, h}) => Rect.make(x, y, w, h))
  }

  celIndex(atlas: Atlas): Integer {
    return Animator.index(this.animator.period, this.animation(atlas).cels)
  }

  get wrap(): Readonly<XY> {
    return this._wrap
  }

  wrapTo(to: Readonly<XY>): void {
    this._wrap.x = to.x
    this._wrap.y = to.y
  }

  get wrapVelocity(): Readonly<XY> {
    return this._wrapVelocity
  }

  wrapVelocityTo(to: Readonly<XY>): void {
    this._wrapVelocity.x = to.x
    this._wrapVelocity.y = to.y
  }
}

export namespace Sprite {
  /** Outermost references have precedence over destructured properties when
      specified. E.g., bounds > position > x. Callers can mutate the referenced
      objects at their own peril. */
  export interface Props {
    readonly id: AtlasID

    /** Defaults to Props.id. */
    readonly constituentID?: AtlasID
    /** Defaults to SpriteComposition.SOURCE. */
    readonly composition?: SpriteComposition

    /** Defaults to a rectangle with atlas source width and height at 0, 0.
        If bounds or size are specified, the source size is not considered. */
    readonly bounds?: Rect
    readonly position?: XY
    readonly x?: Integer
    readonly y?: Integer
    readonly size?: WH
    readonly w?: Integer
    readonly h?: Integer

    /** Defaults to zero. */
    readonly layer?: Integer

    /** Defaults to 1, 1. */
    readonly scale?: XY
    readonly sx?: Integer
    readonly sy?: Integer

    /** Defaults to {period: 0, exposure: 0}. */
    readonly animator?: Animator
    readonly period?: Integer
    readonly exposure?: Milliseconds

    /** Defaults to 0, 0. */
    readonly wrap?: DecamillipixelXY
    readonly wx?: Integer
    readonly wy?: Integer

    /** Defaults to 0, 0. */
    readonly wrapVelocity?: DecamillipixelXY
    readonly wvx?: Integer
    readonly wvy?: Integer
  }

  /** Return the draw order. */
  export function compareElevation(
    lhs: Readonly<Sprite>,
    rhs: Readonly<Sprite>
  ): Integer {
    return (
      lhs.layer - rhs.layer ||
      lhs.bounds.position.y +
        lhs.bounds.size.h -
        (rhs.bounds.position.y + rhs.bounds.size.h)
    )
  }

  export function validateScale({x, y}: Readonly<XY>): void {
    if (!x || !y) throw new Error(`Scale must be nonzero (${x}, ${y}).`)
  }
}
