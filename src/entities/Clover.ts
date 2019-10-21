import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {JSONValue} from '../utils/JSON'
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
        [Entity.BaseState.HIDDEN]: new SpriteRect(),
        [Clover.State.VISIBLE]: new SpriteRect({
          sprites: variantSprites(atlas, props?.variant ?? Clover.Variant.SMALL)
        })
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Clover {
  export enum Variant {
    SMALL = 'small',
    MEDIUM = 'medium'
  }

  export enum State {
    VISIBLE = 'visible'
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
  state: Clover.State.VISIBLE,
  collisionType: CollisionType.TYPE_SCENERY
})
