import {Apple} from './Apple'
import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'
import {Rect} from '../math/Rect'

export class AppleTree extends Entity<AppleTree.Variant, AppleTree.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<AppleTree.Variant, AppleTree.State>
  ) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Entity.BaseState.HIDDEN]: new SpriteRect(),
        [AppleTree.State.VISIBLE]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {id: AtlasID.APPLE_TREE}),
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.APPLE_TREE_SHADOW,
              y: 1,
              layer: Layer.SHADOW
            })
          ]
        })
      },
      children: [
        new Apple(atlas, {x: 2, y: 9}),
        new Apple(atlas, {x: 10, y: 9}),
        new Apple(atlas, {x: 12, y: 8})
      ],
      ...props
    })
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
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

const defaults = Object.freeze({
  type: EntityType.APPLE_TREE,
  variant: AppleTree.Variant.NONE,
  state: AppleTree.State.VISIBLE,
  collisionPredicate: CollisionPredicate.BODIES | CollisionPredicate.CHILDREN,
  collisionBodies: Object.freeze([Object.freeze(Rect.make(3, 10, 7, 1))]),
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE
})
