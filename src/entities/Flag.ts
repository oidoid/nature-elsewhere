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
import {UpdatePredicate} from '../updaters/UpdatePredicate'

export class Flag extends Entity<Flag.Variant, Flag.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Flag.Variant, Flag.State>) {
    super({
      ...defaults,
      map: {
        [Flag.State.NONE]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {id: AtlasID.FLAG}),
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.FLAG_SHADOW,
              x: -1,
              y: 1,
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

export namespace Flag {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    NONE = 'none'
  }
}

const defaults = Object.freeze({
  type: EntityType.FLAG,
  variant: Flag.Variant.NONE,
  state: Flag.State.NONE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  collisionType: CollisionType.TYPE_SCENERY
})
