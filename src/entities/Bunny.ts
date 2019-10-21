import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {UpdatePredicate} from '../updaters/UpdatePredicate'

export class Bunny extends Entity<Bunny.Variant, Bunny.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Bunny.Variant, Bunny.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new SpriteRect(),
        [Bunny.State.IDLE]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {id: AtlasID.BUNNY}),
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.BUNNY_SHADOW,
              layer: Layer.SHADOW,
              y: 1
            })
          ]
        }),
        [Bunny.State.DEAD]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {id: AtlasID.BUNNY_DEAD}),
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.BUNNY_BLOOD,
              layer: Layer.BLOOD
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

export namespace Bunny {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    IDLE = 'idle',
    DEAD = 'dead'
  }
}

const defaults = Object.freeze({
  type: EntityType.BUNNY,
  variant: Bunny.Variant.NONE,
  state: Bunny.State.IDLE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  collisionType: CollisionType.TYPE_CHARACTER | CollisionType.IMPEDIMENT,
  collisionPredicate: CollisionPredicate.BODIES
})
