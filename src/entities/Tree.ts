import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntityConfig} from '../entity/EntityConfig'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Layer} from '../sprite/Layer'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'

export class Tree extends Entity<Tree.Variant, Tree.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Tree.Variant, Tree.State>) {
    super(assemble(atlas, props))
  }

  toJSON(): EntityConfig {
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
    NONE = 'none'
  }
}

function assemble(
  atlas: Atlas,
  props?: Entity.SubProps<Tree.Variant, Tree.State>
): Entity.Props<Tree.Variant, Tree.State> {
  const variant = props?.variant ?? defaults.variant
  const rect = new SpriteRect({sprites: variantSprites(atlas, variant)})
  return {
    ...defaults,
    variant,
    collisionBodies: rect.allBodies(atlas),
    map: {[Tree.State.NONE]: rect},
    ...props
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
  state: Tree.State.NONE,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE
})
