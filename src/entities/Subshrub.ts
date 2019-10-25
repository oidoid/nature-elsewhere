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

export class Subshrub extends Entity<Subshrub.Variant, Subshrub.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Subshrub.Variant, Subshrub.State>
  ) {
    super({
      ...defaults,
      map: {
        [Subshrub.State.NONE]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {id: AtlasID.SUBSHRUB}),
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.SUBSHRUB_SHADOW,
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

export namespace Subshrub {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    NONE = 'none'
  }
}

const defaults = Object.freeze({
  type: EntityType.SUBSHRUB,
  variant: Subshrub.Variant.NONE,
  state: Subshrub.State.NONE,
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.IMPEDIMENT
})
