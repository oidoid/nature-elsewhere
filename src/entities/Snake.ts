import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../image/Layer'
import {ObjectUtil} from '../utils/ObjectUtil'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'

export class Snake extends Entity<Snake.Variant, Snake.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Snake.Variant, Snake.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Snake.State.IDLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.SNAKE}),
            new Image(atlas, {
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

const defaults = ObjectUtil.freeze({
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
