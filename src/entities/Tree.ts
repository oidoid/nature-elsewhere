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
import {JSON} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

export class Tree extends Entity<Tree.Variant, Tree.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Tree.Variant, Tree.State>) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
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
      ...props
    })
  }

  toJSON(): JSON {
    return this._toJSON(defaults)
  }
}

export namespace Tree {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.SCENERY_TREE,
  variant: Tree.Variant.NONE,
  state: Tree.State.VISIBLE,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: [Rect.make(3, 8, 4, 3)],
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE
})
