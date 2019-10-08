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

export class Snake extends Entity<'none', Snake.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<'none', Snake.State>) {
    super({
      type: EntityType.CHAR_SNAKE,
      variant: 'none',
      state: Snake.State.IDLE,
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
      updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
      updaters: [UpdaterType.CIRCLE],
      collisionType:
        CollisionType.TYPE_CHARACTER |
        CollisionType.HARMFUL |
        CollisionType.IMPEDIMENT,
      collisionPredicate: CollisionPredicate.BODIES,
      ...props
    })
  }
}

export namespace Snake {
  export enum State {
    IDLE = 'idle'
  }
}
