import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../../atlas/AtlasID'
import {CollisionPredicate} from '../../collision/CollisionPredicate'
import {Cursor} from './Cursor'
import {Entity} from '../../entity/Entity'
import {EntitySerializer} from '../../entity/EntitySerializer'
import {EntityType} from '../../entity/EntityType'
import {JSONValue} from '../../utils/JSON'
import {Layer} from '../../sprite/Layer'
import {Rect} from '../../math/Rect'
import {Sprite} from '../../sprite/Sprite'
import {SpriteRect} from '../../spriteStateMachine/SpriteRect'
import {UpdatePredicate} from '../../updaters/UpdatePredicate'
import {XY} from '../../math/XY'

export class HandCursor extends Entity<HandCursor.Variant, HandCursor.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<HandCursor.Variant, HandCursor.State>
  ) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Cursor.State.POINT]: variantRect(atlas, Cursor.State.POINT),
        [Cursor.State.PICK]: variantRect(atlas, Cursor.State.PICK)
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace HandCursor {
  export enum Variant {
    INVARIANT = 'invariant'
  }

  // Must match Cursor.State.POINT and Cursor.State.PICK.
  export enum State {
    POINT = 'point',
    PICK = 'pick'
  }
}

const defaults = Object.freeze({
  type: EntityType.UI_CURSOR_HAND,
  variant: HandCursor.Variant.INVARIANT,
  state: HandCursor.State.POINT,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: Object.freeze([Object.freeze(Rect.make(2, 0, 3, 3))])
})

function variantRect(atlas: Atlas, state: Cursor.State): SpriteRect {
  const id =
    state === Cursor.State.POINT
      ? AtlasID.UI_CURSOR_HAND_POINT
      : AtlasID.UI_CURSOR_HAND_PICK
  return new SpriteRect({
    origin: new XY(3, 1),
    sprites: [Sprite.withAtlasSize(atlas, {id, layer: Layer.UI_CURSOR})]
  })
}
