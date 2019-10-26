import {Atlas} from 'aseprite-atlas'
import {CollisionPredicate} from '../../collision/CollisionPredicate'
import {CollisionType} from '../../collision/CollisionType'
import {DotCursor} from './DotCursor'
import {Entity} from '../../entity/Entity'
import {EntityCollider} from '../../collision/EntityCollider'
import {EntitySerializer} from '../../entity/EntitySerializer'
import {EntityType} from '../../entity/EntityType'
import {HandCursor} from './HandCursor'
import {Input} from '../../inputs/Input'
import {JSONValue} from '../../utils/JSON'
import {Level} from '../../levels/Level'
import {ReticleCursor} from './ReticleCursor'
import {SpriteRect} from '../../spriteStateMachine/SpriteRect'
import {UpdatePredicate} from '../../updaters/UpdatePredicate'
import {UpdateState} from '../../updaters/UpdateState'
import {UpdateStatus} from '../../updaters/UpdateStatus'

export class Cursor extends Entity<Cursor.Variant, Cursor.State> {
  constructor(atlas: Atlas, props?: Cursor.Props) {
    super({
      ...defaults,
      // Add dummy child so that setIcon() functions as expected.
      children: [new DotCursor(atlas)],
      map: {
        [Cursor.State.HIDDEN]: new SpriteRect(),
        [Cursor.State.POINT]: new SpriteRect(),
        [Cursor.State.PICK]: new SpriteRect()
      },
      ...props
    })
    this._setIcon(atlas, props?.icon ?? defaults.icon)
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)
    let nextState = this.state
    const {point, pick} = state.inputs
    if (pick && pick.active) {
      // it would be good to throttle this so precise picking is easier
      nextState = Cursor.State.PICK
      const position = Input.levelXY(
        pick,
        state.canvasSize,
        state.level.cam.bounds
      )
      status |= this.moveTo(position)
    } else if (point) {
      nextState = Cursor.State.POINT
      const position = Input.levelXY(
        point,
        state.canvasSize,
        state.level.cam.bounds
      )
      status |= this.moveTo(position)
    }

    const collisionType = EntityCollider.collidesEntities(
      this,
      Level.activeParentsWithPlayer(state.level)
    ).reduce((type, entity) => type | entity.collisionType, CollisionType.INERT)

    if (collisionType & (CollisionType.TYPE_UI | CollisionType.TYPE_ITEM))
      this.setIcon(state.level.atlas, Cursor.Icon.HAND)

    status |= this.transition(nextState)

    return status
  }

  transition(state: Cursor.State): UpdateStatus {
    let status = super.transition(state)
    if (this.children[0].states.includes(state))
      status |= this.children[0].transition(state)
    if (status & UpdateStatus.UPDATED) this.invalidateBounds()
    return status
  }

  get icon(): Cursor.Icon {
    const icon = entityTypeToIcon[this.children[0].type]
    if (icon === undefined)
      throw new Error(`Unknown cursor child type "${this.children[0].type}".`)
    return icon
  }

  setIcon(atlas: Atlas, icon: Cursor.Icon): UpdateStatus {
    if (this.icon === icon) return UpdateStatus.UNCHANGED
    return this._setIcon(atlas, icon)
  }

  toJSON(): JSONValue {
    const diff = EntitySerializer.serialize(this, defaults)
    if (this.icon !== defaults.icon) diff.icon = this.icon
    return diff
  }

  private _setIcon(atlas: Atlas, icon: Cursor.Icon): UpdateStatus {
    const prevCursor = this.children[0]
    const nextCursor =
      icon === Cursor.Icon.DOT
        ? new DotCursor(atlas)
        : icon === Cursor.Icon.RETICLE
        ? new ReticleCursor(atlas)
        : new HandCursor(atlas)
    nextCursor.moveTo(prevCursor.origin)
    this.origin = nextCursor.origin
    const replaced = this.replaceChild(prevCursor, nextCursor)
      ? UpdateStatus.UPDATED
      : UpdateStatus.UNCHANGED
    if (replaced) this.invalidateBounds()
    return replaced ? UpdateStatus.UPDATED : UpdateStatus.UNCHANGED
  }
}

export namespace Cursor {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    HIDDEN = 'hidden',
    POINT = 'point',
    PICK = 'pick'
  }

  export enum Icon {
    DOT = 'dot',
    RETICLE = 'reticle',
    HAND = 'hand'
  }

  export interface Props extends Entity.SubProps<Cursor.Variant, Cursor.State> {
    icon?: Icon
  }
}

const entityTypeToIcon: Readonly<Partial<
  Record<EntityType, Cursor.Icon>
>> = Object.freeze({
  [EntityType.UI_CURSOR_DOT]: Cursor.Icon.DOT,
  [EntityType.UI_CURSOR_RETICLE]: Cursor.Icon.RETICLE,
  [EntityType.UI_CURSOR_HAND]: Cursor.Icon.HAND
})

const defaults = Object.freeze({
  type: EntityType.UI_CURSOR,
  variant: Cursor.Variant.NONE,
  state: Cursor.State.HIDDEN,
  icon: Cursor.Icon.DOT,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionPredicate: CollisionPredicate.CHILDREN
})
