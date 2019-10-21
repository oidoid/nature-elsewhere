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

export class Pig extends Entity<Pig.Variant, Pig.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Pig.Variant, Pig.State>) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new SpriteRect(),
        [Pig.State.IDLE]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {id: AtlasID.PIG}),
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.PIG_SHADOW,
              y: 1,
              layer: Layer.SHADOW
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

export namespace Pig {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    IDLE = 'idle'
  }
}

const defaults = Object.freeze({
  type: EntityType.PIG,
  variant: Pig.Variant.NONE,
  state: Pig.State.IDLE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  collisionType: CollisionType.TYPE_CHARACTER | CollisionType.OBSTACLE,
  collisionPredicate: CollisionPredicate.BODIES
})
