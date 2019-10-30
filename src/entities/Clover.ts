import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntityConfig} from '../entity/EntityConfig'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Layer} from '../sprite/Layer'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'

export class Clover extends Entity<Clover.Variant, Clover.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Clover.Variant, Clover.State>
  ) {
    super({
      ...defaults,
      map: {
        [Clover.State.NONE]: new SpriteRect({
          sprites: variantSprites(atlas, props?.variant ?? Clover.Variant.SMALL)
        })
      },
      ...props
    })
  }

  toJSON(): EntityConfig {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Clover {
  export enum Variant {
    SMALL = 'small',
    MEDIUM = 'medium'
  }

  export enum State {
    NONE = 'none'
  }
}

function variantSprites(atlas: Atlas, variant: Clover.Variant): Sprite[] {
  if (variant === Clover.Variant.SMALL)
    return [
      Sprite.withAtlasSize(atlas, {id: AtlasID.CLOVER_0x0, layer: Layer.DECAL}),
      Sprite.withAtlasSize(atlas, {
        id: AtlasID.CLOVER_0x1,
        x: 1,
        y: 3,
        layer: Layer.DECAL
      }),
      Sprite.withAtlasSize(atlas, {
        id: AtlasID.CLOVER_0x0,
        x: 4,
        y: 1,
        layer: Layer.DECAL
      })
    ]
  return [
    Sprite.withAtlasSize(atlas, {id: AtlasID.CLOVER_1x0, layer: Layer.DECAL}),
    Sprite.withAtlasSize(atlas, {
      id: AtlasID.CLOVER_0x1,
      x: 1,
      y: 3,
      layer: Layer.DECAL
    }),
    Sprite.withAtlasSize(atlas, {
      id: AtlasID.CLOVER_1x0,
      x: 4,
      y: 1,
      layer: Layer.DECAL
    })
  ]
}

const defaults = Object.freeze({
  type: EntityType.CLOVER,
  variant: Clover.Variant.SMALL,
  state: Clover.State.NONE,
  collisionType: CollisionType.TYPE_SCENERY
})
