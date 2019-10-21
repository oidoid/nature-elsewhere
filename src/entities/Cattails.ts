import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {JSONValue} from '../utils/JSON'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'

export class Cattails extends Entity<Cattails.Variant, Cattails.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Cattails.Variant, Cattails.State>
  ) {
    super({
      ...defaults,
      map: {
        [Cattails.State.VISIBLE]: new SpriteRect({
          sprites: [Sprite.withAtlasSize(atlas, {id: AtlasID.CATTAILS})]
        })
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Cattails {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = Object.freeze({
  type: EntityType.CATTAILS,
  variant: Cattails.Variant.NONE,
  state: Cattails.State.VISIBLE,
  collisionType: CollisionType.TYPE_SCENERY
})
