import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {XY} from '../math/XY'
import {Layer} from '../image/Layer'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {Rect} from '../math/Rect'
import {CollisionType} from '../collision/CollisionType'
import {Atlas} from 'aseprite-atlas'

export class Mountain extends Entity<'none', Mountain.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<'none', Mountain.State>) {
    super({
      type: EntityType.SCENERY_MOUNTAIN,
      variant: 'none',
      state: Mountain.State.VISIBLE,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Mountain.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.SCENERY_MOUNTAIN}),
            new Image(atlas, {
              id: AtlasID.SCENERY_MOUNTAIN_SHADOW,
              position: new XY(-2, 1),
              layer: Layer.SHADOW
            })
          ]
        })
      },
      collisionPredicate: CollisionPredicate.BODIES,
      collisionBodies: [Rect.make(0, 5, 13, 4)],
      collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE,
      ...props
    })
  }
}

export namespace Mountain {
  export enum State {
    VISIBLE = 'visible'
  }
}
