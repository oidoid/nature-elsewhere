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

export class Conifer extends Entity<'none', Conifer.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<'none', Conifer.State>) {
    super({
      type: EntityType.SCENERY_CONIFER,
      variant: 'none',
      state: Conifer.State.VISIBLE,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Conifer.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.SCENERY_CONIFER}),
            new Image(atlas, {
              id: AtlasID.SCENERY_CONIFER_SHADOW,
              position: new XY(0, 1),
              layer: Layer.SHADOW
            })
          ]
        })
      },
      collisionPredicate: CollisionPredicate.BODIES,
      collisionBodies: [Rect.make(2, 9, 3, 3)],
      collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE,
      ...props
    })
  }
}

export namespace Conifer {
  export enum State {
    VISIBLE = 'visible'
  }
}
