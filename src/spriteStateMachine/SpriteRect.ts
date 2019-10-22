import {AtlasID} from '../atlas/AtlasID'
import {Layer} from '../sprite/Layer'
import {ReadonlyRect, Rect} from '../math/Rect'
import {Sprite} from '../sprite/Sprite'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {XY} from '../math/XY'

/** A coordinate system of Sprites. Different sprites are shown for different
    Entity states. A SpriteRect is used to group all Sprites for a given state.

    Since Sprites are arranged relative to each other and the system, the system
    location in level coordinates is preserved so that a subsequent update can
    correctly reconcile the current state of the Sprites and the requested
    change relative to the system coordinates.

    E.g., consider an entity with a visible and a hidden state. The letter A is
    shown at level coordinates 5,5 in the visible state. Then the state is
    changed to hidden and moved to 10,10. Finally, the state is changed back to
    visible. The expected result is to render A at 10,10. However, without
    SpriteRect tracking the position, A would appear at 5,5.

    Additionally, SpriteRect offers a cached bounding box that contains all of
    its images. This can be used for quick viewport render and collision
    tests. */
export class SpriteRect {
  /** The upper-left and size of the local coordinate system in level
      coordinates. The sprites are moved relative this position and origin. */
  private readonly _bounds: Rect

  /** For sprites that require an additional offset to be included move
      computations. */
  private readonly _origin: Readonly<XY>

  /** Collision bodies and sprite rectangles include absolute scaling in their
      dimensions. Nonzero scaling is enforced so that operations are reversible.
      The scalar sign is only considered when rendering the flipped or unflipped
      sprite. Each sprite's original orientation is preserved in Sprite so that
      a SpriteRect composed of a mishmash of flipped sprites will mirror that
      mishmash and not lose each individual's sprite's relative flip. */
  private readonly _scale: XY

  /** If set, the constituentID for all sprites. See Sprite._constituentID. The
      reversal is lossy when the transformed Sprite's original constituentID was
      not Sprite.id. */
  private _constituentID?: AtlasID

  /** The relative offset for each layer. */
  private _elevation: Layer

  /** Sprite coordinates are not relative the bounds origin, they're in level
      coordinates. */
  private readonly _sprites: Sprite[]

  constructor(props: SpriteRect.Props = {}) {
    this._origin = props.origin ?? new XY(0, 0)
    this._bounds = Rect.make(0, 0, 0, 0)
    this._scale = new XY(1, 1)
    this._sprites = props.sprites ?? []
    this._constituentID = props.constituentID
    this._elevation = props.elevation ?? 0
    this.invalidate()
    if (props.position) this.moveTo(props.position)
    if (props.scale) this.scaleBy(props.scale)
  }

  /** See SpriteRect._bounds. */
  get bounds(): ReadonlyRect {
    return this._bounds
  }

  /** See SpriteRect._origin. */
  get origin(): Readonly<XY> {
    return this.bounds.position.add(this._origin)
  }

  moveTo(to: Readonly<XY>): UpdateStatus {
    return this.moveBy(to.sub(this.origin))
  }

  moveBy(by: Readonly<XY>): UpdateStatus {
    if (!by.x && !by.y) return UpdateStatus.UNCHANGED
    this._bounds.position.x += by.x
    this._bounds.position.y += by.y
    for (const sprite of this.sprites) sprite.moveBy(by)
    return UpdateStatus.UPDATED
  }

  get scale(): Readonly<XY> {
    return this._scale
  }

  scaleTo(to: Readonly<XY>): UpdateStatus {
    return this.scaleBy(to.div(this.scale))
  }

  scaleBy(by: Readonly<XY>): UpdateStatus {
    if (by.x === 1 && by.y === 1) return UpdateStatus.UNCHANGED
    Sprite.validateScale(by)
    for (const sprite of this.sprites) sprite.scaleBy(by)
    this._scale.x *= by.x
    this._scale.y *= by.y
    this.invalidate()
    return UpdateStatus.UPDATED
  }

  get constituentID(): Maybe<AtlasID> {
    return this._constituentID
  }

  setConstituentID(id: Maybe<AtlasID>): UpdateStatus {
    if (this.constituentID === id) return UpdateStatus.UNCHANGED
    this._constituentID = id
    for (const sprite of this._sprites) sprite.constituentID = id ?? sprite.id
    return UpdateStatus.UPDATED
  }

  get elevation(): Layer {
    return this._elevation
  }

  elevateTo(to: Layer): UpdateStatus {
    return this.elevateBy(to - this.elevation)
  }

  elevateBy(by: Layer): UpdateStatus {
    if (!by) return UpdateStatus.UNCHANGED
    this._elevation += by
    for (const sprite of this._sprites) sprite.layer += by
    return UpdateStatus.UPDATED
  }

  get sprites(): readonly Readonly<Sprite>[] {
    return this._sprites
  }

  add(...sprites: readonly Sprite[]): void {
    this._sprites.push(...sprites)
    this.invalidate()
  }

  replace(...sprites: readonly Sprite[]): void {
    this._sprites.length = 0
    this.add(...sprites)
  }

  intersects(bounds: ReadonlyRect): Readonly<Sprite>[] {
    return this.sprites.filter(sprite => Rect.intersects(bounds, sprite.bounds))
  }

  invalidate(): void {
    const union = Rect.unionAll(this.sprites.map(sprite => sprite.bounds))
    if (!union) return

    // Invalidation crops the sprite to its images. This may cause the upper
    // left of the SpriteRect to move which may be unexpected if an image was
    // intended to remain at an offset from the upper left. In this case, use
    // origin.
    this._bounds.position.x = union.position.x
    this._bounds.position.y = union.position.y

    this._bounds.size.w = union.size.w
    this._bounds.size.h = union.size.h
  }

  resetAnimation(): void {
    for (const sprite of this.sprites) sprite.resetAnimation()
  }
}

export namespace SpriteRect {
  export interface Props {
    readonly position?: XY
    readonly origin?: Readonly<XY>
    readonly scale?: XY
    readonly constituentID?: AtlasID
    readonly elevation?: Layer
    readonly sprites?: Sprite[]
  }
}
