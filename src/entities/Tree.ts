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

export class Tree extends Entity<'none', Tree.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<'none', Tree.State>) {
    super({
      type: EntityType.SCENERY_TREE,
      variant: 'none',
      state: Tree.State.VISIBLE,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Tree.State.VISIBLE]: new ImageRect({
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

export namespace Tree {
  export enum State {
    VISIBLE = 'visible'
  }
}
