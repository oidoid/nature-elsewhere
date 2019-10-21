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

export class Apple extends Entity<Apple.Variant, Apple.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Apple.Variant, Apple.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new SpriteRect(),
        [Apple.State.VISIBLE]: new SpriteRect({
          sprites: [Sprite.withAtlasSize(atlas, {id: AtlasID.PALETTE_RED})]
        })
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Apple {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = Object.freeze({
  type: EntityType.APPLE,
  variant: Apple.Variant.NONE,
  state: Apple.State.VISIBLE,
  collisionPredicate: CollisionPredicate.SPRITES,
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.TYPE_ITEM
})
