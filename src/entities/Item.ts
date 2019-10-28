import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'

export class Item extends Entity<Item.Variant, Item.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Item.Variant, Item.State>) {
    super({
      ...defaults,
      map: {
        [Item.State.NONE]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {id: AtlasID.ITEM_APPLE}),
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.ITEM_APPLE_SHADOW,
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

export namespace Item {
  export enum Variant {
    APPLE = 'itemApple'
  }

  export enum State {
    NONE = 'none'
  }
}

const defaults = Object.freeze({
  type: EntityType.ITEM,
  variant: Item.Variant.APPLE,
  state: Item.State.NONE,
  collisionPredicate: CollisionPredicate.SPRITES,
  collisionType: CollisionType.TYPE_UI | CollisionType.TYPE_ITEM
})
