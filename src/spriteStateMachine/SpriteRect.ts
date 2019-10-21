import {AtlasID} from '../atlas/AtlasID'
import {Layer} from '../sprite/Layer'
import {ReadonlyRect, Rect} from '../math/Rect'
import {Sprite} from '../sprite/Sprite'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {XY} from '../math/XY'

export class SpriteRect {
  /** The upper-left and size of the local coordinate system. The sprites are
      moved relative this position. */
  private readonly _bounds: Rect

  /** For sprites that require a center offset, an origin may be specified and
      referenced manually in translation calculations. */
  private readonly _origin: XY

  /** Collision bodies are not scaled. Sprite.bounds includes scaling so
      SpriteRect.bounds does as well. flipImages only controls whether each
      sprite in the SproteRect is flipped or not. The original orientation is
      considered so a flipped entity composed of a mishmash of flipped sprites
      will mirror that mishmash and not lose each individual's sprite's relative
      flip.

      Always use non-zero scaling so that Entity can determine relative scaling
      of collision bodies. */
  private readonly _scale: XY

  /** Sprite coordinates are not relative the bounds origin, they're in level
      coordinates. These should usually only be passed statically by the entity.
      If additional sprites are needed, it is often best to add a child Entity
      instead. */
  private readonly _sprites: Sprite[]

  /** If set, the constituentID for all sprites. See Sprite._constituentID. */
  private _constituentID?: AtlasID

  constructor(props: SpriteRect.Props = {}) {
    this._origin = props.origin ?? new XY(0, 0)
    this._bounds = Rect.make(0, 0, 0, 0)
    this._scale = new XY(1, 1)
    this._sprites = props.sprites ?? []
    this._constituentID = props.constituentID
    this.invalidate()
    if (props.position) this.moveBy(props.position)
    if (props.scale) this.scaleBy(props.scale)
  }

  get bounds(): ReadonlyRect {
    return this._bounds
  }

  /** See SpriteRect._origin. */
  get origin(): Readonly<XY> {
    return this._origin
  }

  get scale(): Readonly<XY> {
    return this._scale
  }

  get sprites(): readonly Readonly<Sprite>[] {
    return this._sprites
  }

  get constituentID(): Maybe<AtlasID> {
    return this._constituentID
  }

  setConstituentID(id?: AtlasID): UpdateStatus {
    if (this.constituentID === id) return UpdateStatus.UNCHANGED
    this._constituentID = id
    for (const sprite of this._sprites) sprite.constituentID = id ?? sprite.id
    return UpdateStatus.UPDATED
  }

  add(...sprites: readonly Sprite[]): void {
    this._sprites.push(...sprites)
    this.invalidate()
  }

  replace(...sprites: readonly Sprite[]): void {
    this._sprites.length = 0
    this.add(...sprites)
  }

  moveTo(to: Readonly<XY>): UpdateStatus {
    return this.moveBy(to.sub(this.bounds.position))
  }

  moveBy(by: Readonly<XY>): UpdateStatus {
    if (!by.x && !by.y) return UpdateStatus.UNCHANGED
    this._bounds.position.x += by.x
    this._bounds.position.y += by.y
    for (const sprite of this.sprites) sprite.moveBy(by)
    return UpdateStatus.UPDATED
  }

  scaleTo(to: Readonly<XY>): UpdateStatus {
    Sprite.validateScale(to)
    if (this.scale.equal(to)) return UpdateStatus.UNCHANGED
    for (const sprite of this.sprites) sprite.scaleBy(to.div(this.scale))
    this._scale.x = to.x
    this._scale.y = to.y
    this.invalidate()
    return UpdateStatus.UPDATED
  }

  scaleBy(scale: Readonly<XY>): void {
    this.scaleTo(scale.mul(this.scale))
  }

  elevate(offset: Layer): void {
    for (const sprite of this._sprites) sprite.layer += offset
  }

  intersects(bounds: ReadonlyRect): Readonly<Sprite>[] {
    return this.sprites.filter(sprite => Rect.intersects(bounds, sprite.bounds))
  }

  invalidate(): void {
    const union = Rect.unionAll(this.sprites.map(sprite => sprite.bounds))
    if (!union) return
    this._bounds.position.x = union.position.x
    this._bounds.position.y = union.position.y
    this._bounds.size.w = union.size.w
    this._bounds.size.h = union.size.h
  }
}

export namespace SpriteRect {
  export interface Props {
    readonly origin?: XY
    readonly position?: XY
    readonly scale?: XY
    readonly sprites?: Sprite[]
    readonly constituentID?: AtlasID
  }
}
