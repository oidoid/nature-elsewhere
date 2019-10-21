import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'
import {Rect} from '../math/Rect'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'

export class Tree extends Entity<Tree.Variant, Tree.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Tree.Variant, Tree.State>) {
    super({
      ...defaults,
      collisionBodies: atlas.animations[
        (props?.variant ?? defaults.variant) === Tree.Variant.SMALL
          ? AtlasID.TREE_SMALL
          : AtlasID.TREE_LARGE
      ].cels[0].slices.map(({x, y, w, h}) => Rect.make(x, y, w, h)),
      map: {
        [Entity.BaseState.HIDDEN]: new SpriteRect(),
        [Tree.State.VISIBLE]: new SpriteRect({
          sprites: variantSprites(
            atlas,
            (props && props.variant) || defaults.variant
          )
        })
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Tree {
  export enum Variant {
    SMALL = 'small',
    LARGE = 'large',
    LARGE_BARE = 'largeBare'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

function variantSprites(atlas: Atlas, variant: Tree.Variant): Sprite[] {
  if (variant === Tree.Variant.SMALL)
    return [
      Sprite.withAtlasSize(atlas, {id: AtlasID.TREE_SMALL}),
      Sprite.withAtlasSize(atlas, {
        id: AtlasID.TREE_SMALL_SHADOW,
        y: 1,
        layer: Layer.SHADOW
      })
    ]

  return [
    Sprite.withAtlasSize(atlas, {
      id:
        variant === Tree.Variant.LARGE
          ? AtlasID.TREE_LARGE
          : AtlasID.TREE_LARGE_BARE
    }),
    Sprite.withAtlasSize(atlas, {
      id: AtlasID.TREE_LARGE_SHADOW,
      y: 2,
      layer: Layer.SHADOW
    })
  ]
}

const defaults = Object.freeze({
  type: EntityType.TREE,
  variant: Tree.Variant.SMALL,
  state: Tree.State.VISIBLE,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE
})
