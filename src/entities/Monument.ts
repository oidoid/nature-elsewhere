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

export class Monument extends Entity<Monument.Variant, Monument.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Monument.Variant, Monument.State>
  ) {
    super(assemble(atlas, props))
  }

  toJSON(): EntityConfig {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Monument {
  export enum Variant {
    SMALL = 'small',
    MEDIUM = 'medium'
  }

  export enum State {
    NONE = 'none'
  }
}

const defaults = Object.freeze({
  type: EntityType.MONUMENT,
  variant: Monument.Variant.SMALL,
  state: Monument.State.NONE,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE
})

function assemble(
  atlas: Atlas,
  props?: Entity.SubProps<Monument.Variant, Monument.State>
): Entity.Props<Monument.Variant, Monument.State> {
  const variant = props?.variant ?? defaults.variant
  const small = variant === Monument.Variant.SMALL
  const rect = new SpriteRect({
    sprites: [
      Sprite.withAtlasSize(atlas, {
        id: small ? AtlasID.MONUMENT_SMALL : AtlasID.MONUMENT_MEDIUM
      }),
      Sprite.withAtlasSize(atlas, {
        id: small
          ? AtlasID.MONUMENT_SMALL_SHADOW
          : AtlasID.MONUMENT_MEDIUM_SHADOW,
        y: 1,
        layer: Layer.SHADOW
      })
    ]
  })
  return {
    ...defaults,
    variant,
    collisionBodies: rect.allBodies(atlas),
    map: {[Monument.State.NONE]: rect},
    ...props
  }
}
