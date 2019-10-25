import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {JSONValue} from '../utils/JSON'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'

export class Fruit extends Entity<Fruit.Variant, Fruit.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Fruit.Variant, Fruit.State>
  ) {
    super({
      ...defaults,
      map: {
        [Fruit.State.NONE]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {
              id: variantToAtlasID[props?.variant ?? defaults.variant]
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

export namespace Fruit {
  export enum Variant {
    APPLE = 'apple',
    BANANA = 'banana',
    BLUEBERRY = 'blueberry',
    GRAPE = 'grape'
  }

  export enum State {
    NONE = 'none'
  }
}

const defaults = Object.freeze({
  type: EntityType.FRUIT,
  variant: Fruit.Variant.APPLE,
  state: Fruit.State.NONE,
  collisionPredicate: CollisionPredicate.SPRITES,
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.TYPE_ITEM
})

const variantToAtlasID: Readonly<Record<
  Fruit.Variant,
  AtlasID
>> = Object.freeze({
  [Fruit.Variant.APPLE]: AtlasID.PALETTE_RED,
  [Fruit.Variant.BANANA]: AtlasID.PALETTE_ORANGE,
  [Fruit.Variant.BLUEBERRY]: AtlasID.PALETTE_LIGHT_BLUE,
  [Fruit.Variant.GRAPE]: AtlasID.PALETTE_BLUE
})
