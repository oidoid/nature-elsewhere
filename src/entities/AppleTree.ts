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
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'
import {Apple} from './Apple'

export class AppleTree extends Entity<AppleTree.Variant, AppleTree.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<AppleTree.Variant, AppleTree.State>
  ) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [AppleTree.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.APPLE_TREE}),
            new Image(atlas, {
              id: AtlasID.APPLE_TREE_SHADOW,
              position: new XY(0, 1),
              layer: Layer.SHADOW
            })
          ]
        })
      },
      children: [
        new Apple(atlas, {position: new XY(2, 9)}),
        new Apple(atlas, {position: new XY(10, 9)}),
        new Apple(atlas, {position: new XY(12, 8)})
      ],
      ...props
    })
  }

  toJSON(): JSONValue {
    return this._toJSON(defaults)
  }
}

export namespace AppleTree {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.APPLE_TREE,
  variant: AppleTree.Variant.NONE,
  state: AppleTree.State.VISIBLE,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: [Rect.make(3, 10, 7, 1)],
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE
})
