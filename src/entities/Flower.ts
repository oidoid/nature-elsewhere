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

export class Flower extends Entity<Flower.Variant, Flower.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Flower.Variant, Flower.State>
  ) {
    super({
      ...defaults,
      map: {
        [Flower.State.NONE]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {id: AtlasID.FLOWER}),
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.FLOWER_SHADOW,
              layer: Layer.SHADOW
            })
          ]
        })
      },
      ...props
    })
  }

  toJSON(): EntityConfig {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Flower {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    NONE = 'none'
  }
}

const defaults = Object.freeze({
  type: EntityType.FLOWER,
  variant: Flower.Variant.NONE,
  state: Flower.State.NONE,
  collisionType: CollisionType.TYPE_SCENERY
})
