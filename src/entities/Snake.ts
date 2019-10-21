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

export class Snake extends Entity<Snake.Variant, Snake.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Snake.Variant, Snake.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new SpriteRect(),
        [Snake.State.IDLE]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {id: AtlasID.SNAKE}),
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.SNAKE_SHADOW,
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

export namespace Snake {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    IDLE = 'idle'
  }
}

const defaults = Object.freeze({
  type: EntityType.SNAKE,
  variant: Snake.Variant.NONE,
  state: Snake.State.IDLE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  collisionType:
    CollisionType.TYPE_CHARACTER |
    CollisionType.HARMFUL |
    CollisionType.IMPEDIMENT,
  collisionPredicate: CollisionPredicate.BODIES
})
