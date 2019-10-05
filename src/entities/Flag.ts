import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {XY} from '../math/XY'
import {Layer} from '../image/Layer'
import {Atlas} from 'aseprite-atlas'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {CollisionType} from '../collision/CollisionType'

export class Flag extends Entity {
  constructor(atlas: Atlas, props?: Optional<Entity.Props, 'type'>) {
    super({
      type: EntityType.SCENERY_FLAG,
      state: FlagState.VISIBLE,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [FlagState.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.SCENERY_FLAG}),
            new Image(atlas, {
              id: AtlasID.SCENERY_FLAG_SHADOW,
              position: new XY(-1, 1),
              layer: Layer.SHADOW
            })
          ]
        })
      },
      updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
      collisionType: CollisionType.TYPE_SCENERY,
      ...props
    })
  }
}

export enum FlagState {
  VISIBLE = 'visible'
}
