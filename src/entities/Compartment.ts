import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntityCollider} from '../collision/EntityCollider'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Input} from '../inputs/Input'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'
import {NumberUtil} from '../math/NumberUtil'
import {Rect} from '../math/Rect'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {UpdateState} from '../updaters/UpdateState'
import {SpriteStateMap} from '../spriteStateMachine/SpriteStateMachine'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

export class Compartment extends Entity<
  Compartment.Variant,
  Compartment.State
> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Compartment.Variant, Compartment.State>
  ) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: variantMap(atlas),
      ...props
    })
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)

    const from = this.sprites[SpriteIndex.DRAWER].bounds.position.x
    const to =
      this.origin.x + (this.opened ? -1 : 0) * (drawerProtrusion + drawerWidth)
    const interpolation = NumberUtil.lerpInt(from, to, 0.2)
    this.sprites[SpriteIndex.DRAWER].moveTo(
      new XY(interpolation, this.origin.y)
    )

    const collision = EntityCollider.collidesEntity(state.level.cursor, this)
    if (collision.length) status |= this.collides(collision, state)

    return status
  }

  collides(entities: readonly Entity[], state: UpdateState): UpdateStatus {
    let status = super.collides(entities, state)

    const triggered = Input.activeTriggered(state.inputs.pick)
    if (!triggered) return status

    const nextState = this.opened
      ? Compartment.State.CLOSED
      : Compartment.State.OPENED

    const {position} = this.sprites[SpriteIndex.DRAWER].bounds
    // Don't return TERMINATE. The rest of the HUD needs to update.
    status |= this.transition(nextState)

    // Copy the last state's drawer position so that the drawer can have an
    // intermediate position.
    this.sprites[SpriteIndex.DRAWER].moveTo(position)

    return status
  }

  invalidateBounds(): void {
    this._bounds.size.w = unitSize.w
    this._bounds.size.h = unitSize.h
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }

  get opened(): boolean {
    return this.state === Compartment.State.OPENED
  }
}

export namespace Compartment {
  export enum Variant {
    EGG = 'egg'
  }

  export enum State {
    CLOSED = 'closed',
    OPENED = 'opened' // How to gracefully animate between states? They're identical states except for the animation position.
  }
}

function variantMap(atlas: Atlas): SpriteStateMap<Compartment.State> {
  return {
    [Compartment.State.CLOSED]: new SpriteRect({
      sprites: variantSprites(atlas, Compartment.State.CLOSED)
    }),
    [Compartment.State.OPENED]: new SpriteRect({
      sprites: variantSprites(atlas, Compartment.State.OPENED)
    })
  }
}

function variantSprites(atlas: Atlas, state: Compartment.State): Sprite[] {
  const sprites = []
  sprites[SpriteIndex.DRAWER] = Sprite.withAtlasSize(atlas, {
    id: AtlasID.EGG_COMPARTMENT_DRAWER,
    x: drawerProtrusion,
    layer: Layer.UI_HI
  })
  sprites[SpriteIndex.UNIT] = Sprite.withAtlasSize(atlas, {
    id:
      state === Compartment.State.OPENED
        ? AtlasID.EGG_COMPARTMENT_UNIT_PRESSED
        : AtlasID.EGG_COMPARTMENT_UNIT,
    layer: Layer.UI_HIHI
  })
  return sprites
}

enum SpriteIndex {
  UNIT,
  DRAWER
}

const drawerProtrusion: number = -2
const drawerWidth: number = 49
const unitSize: Readonly<WH> = Object.freeze(new WH(17, 17))

const defaults = Object.freeze({
  type: EntityType.COMPARTMENT,
  variant: Compartment.Variant.EGG,
  state: Compartment.State.CLOSED,
  collisionType: CollisionType.TYPE_UI,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: Object.freeze([
    Object.freeze(Rect.make(0, 0, unitSize.w, unitSize.h))
  ])
})
