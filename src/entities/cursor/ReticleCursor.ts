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

export class ReticleCursor extends Entity<
  ReticleCursor.Variant,
  ReticleCursor.State
> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<ReticleCursor.Variant, ReticleCursor.State>
  ) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [ReticleCursor.State.STATELESS]: new SpriteRect({
          origin: new XY(4, 3),
          sprites: [
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.UI_CURSOR_RETICLE,
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

export namespace ReticleCursor {
  export enum Variant {
    INVARIANT = 'invariant'
  }

  export enum State {
    STATELESS = 'stateless'
  }
}

const defaults = Object.freeze({
  type: EntityType.UI_CURSOR_RETICLE,
  variant: ReticleCursor.Variant.INVARIANT,
  state: ReticleCursor.State.STATELESS,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: Object.freeze([Object.freeze(Rect.make(3, 2, 3, 3))]) // All the cursor have to match sizes to avoid oscillating between cursor icon types.
})
