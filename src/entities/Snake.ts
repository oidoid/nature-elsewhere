import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdaterType} from '../updaters/updaterType/UpdaterType'
import {CollisionType} from '../collision/CollisionType'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {Layer} from '../image/Layer'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

export class Snake extends Entity<Snake.Variant, Snake.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Snake.Variant, Snake.State>
  ) {
    super({
      ...defaults,
      updaters: [...defaults.updaters],
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Snake.State.IDLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.CHAR_SNAKE}),
            new Image(atlas, {
              id: AtlasID.CHAR_SNAKE_SHADOW,
              layer: Layer.SHADOW
            })
          ]
        })
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return this._toJSON(defaults)
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
  type: EntityType.CHAR_SNAKE,
  variant: Snake.Variant.NONE,
  state: Snake.State.IDLE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  updaters: [UpdaterType.CIRCLE],
  collisionType:
    CollisionType.TYPE_CHARACTER |
    CollisionType.HARMFUL |
    CollisionType.IMPEDIMENT,
  collisionPredicate: CollisionPredicate.BODIES
})
