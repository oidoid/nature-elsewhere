import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntityConfig} from '../entity/EntityConfig'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
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
        [Cattails.State.NONE]: new SpriteRect({
          sprites: [Sprite.withAtlasSize(atlas, {id: AtlasID.CATTAILS})]
        })
      },
      ...props
    })
  }

  toJSON(): EntityConfig {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Cattails {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    NONE = 'none'
  }
}

const defaults = Object.freeze({
  type: EntityType.CATTAILS,
  variant: Cattails.Variant.NONE,
  state: Cattails.State.NONE,
  collisionType: CollisionType.TYPE_SCENERY
})
