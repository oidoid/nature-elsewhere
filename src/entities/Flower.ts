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

export class Flower extends Entity<Flower.Variant, Flower.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Flower.Variant, Flower.State>
  ) {
    super({
      ...defaults,
      map: {
        [Flower.State.STATELESS]: new SpriteRect({
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

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Flower {
  export enum Variant {
    INVARIANT = 'invariant'
  }

  export enum State {
    STATELESS = 'stateless'
  }
}

const defaults = Object.freeze({
  type: EntityType.FLOWER,
  variant: Flower.Variant.INVARIANT,
  state: Flower.State.STATELESS,
  collisionType: CollisionType.TYPE_SCENERY
})
