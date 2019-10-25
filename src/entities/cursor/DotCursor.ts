import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../../atlas/AtlasID'
import {CollisionPredicate} from '../../collision/CollisionPredicate'
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

export class DotCursor extends Entity<DotCursor.Variant, DotCursor.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<DotCursor.Variant, DotCursor.State>
  ) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [DotCursor.State.NONE]: new SpriteRect({
          origin: new XY(1, 1),
          sprites: [
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.PALETTE_BLACK,
              layer: Layer.UI_CURSOR
            })
          ]
        })
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace DotCursor {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    NONE = 'none'
  }
}

const defaults = Object.freeze({
  type: EntityType.UI_CURSOR_DOT,
  variant: DotCursor.Variant.NONE,
  state: DotCursor.State.NONE,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: Object.freeze([Object.freeze(Rect.make(-1, -1, 3, 3))])
})
