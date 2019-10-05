import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entity/EntityType'
import {ImageRect} from '../../imageStateMachine/ImageRect'
import {Image} from '../../image/Image'
import {AtlasID} from '../../atlas/AtlasID'
import {XY} from '../../math/XY'
import {Layer} from '../../image/Layer'
import {CollisionPredicate} from '../../collision/CollisionPredicate'
import {Rect} from '../../math/Rect'
import {CollisionType} from '../../collision/CollisionType'
import {Atlas} from 'aseprite-atlas'

export class Tree extends Entity {
  constructor(atlas: Atlas, props?: Entity.Props) {
    super({
      type: EntityType.SCENERY_TREE,
      state: TreeState.VISIBLE,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [TreeState.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.SCENERY_TREE}),
            new Image(atlas, {
              id: AtlasID.SCENERY_TREE_SHADOW,
              position: new XY(0, 1),
              layer: Layer.SHADOW
            })
          ]
        })
      },
      collisionPredicate: CollisionPredicate.BODIES,
      collisionBodies: [Rect.make(3, 8, 4, 3)],
      collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE,
      ...props
    })
  }
}

export enum TreeState {
  VISIBLE = 'visible'
}
