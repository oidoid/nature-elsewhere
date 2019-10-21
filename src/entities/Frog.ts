import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'
import {Rect} from '../math/Rect'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {UpdatePredicate} from '../updaters/UpdatePredicate'

export class Frog extends Entity<Frog.Variant, Frog.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Frog.Variant, Frog.State>) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Entity.BaseState.HIDDEN]: new SpriteRect(),
        [Frog.State.IDLE]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {id: AtlasID.FROG_IDLE}),
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.FROG_IDLE_SHADOW,
              x: -1,
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

export namespace Frog {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    IDLE = 'idle'
  }
}

const defaults = Object.freeze({
  type: EntityType.FROG,
  state: Frog.State.IDLE,
  variant: Frog.Variant.NONE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  collisionType: CollisionType.TYPE_CHARACTER | CollisionType.OBSTACLE,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: Object.freeze([Object.freeze(Rect.make(1, 14, 6, 2))])
})
