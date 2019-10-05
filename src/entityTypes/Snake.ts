import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {UpdatePredicate} from '../entities/updaters/updatePredicate/UpdatePredicate'
import {UpdaterType} from '../entities/updaters/updaterType/UpdaterType'
import {CollisionType} from '../collision/CollisionType'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {Layer} from '../image/Layer'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'

export class Snake extends Entity {
  constructor(atlas: Atlas, props?: Entity.Props) {
    super({
      type: EntityType.CHAR_SNAKE,
      state: SnakeState.IDLE,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [SnakeState.IDLE]: new ImageRect({
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

export enum SnakeState {
  IDLE = 'idle'
}
