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

export class Fly extends Entity<Fly.Variant, Fly.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Fly.Variant, Fly.State>) {
    super({
      ...defaults,
      map: {
        [Fly.State.IDLE]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {id: AtlasID.PALETTE_GREY}),
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.PALETTE_LIGHT_GREY,
              y: 2,
              layer: Layer.SHADOW
            })
          ]
        }),
        [Fly.State.DEAD]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.PALETTE_RED,
              layer: Layer.BLOOD
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

export namespace Fly {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    IDLE = 'idle',
    DEAD = 'dead'
  }
}

const defaults = Object.freeze({
  type: EntityType.FLY,
  state: Fly.State.IDLE,
  variant: Fly.Variant.NONE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  collisionType: CollisionType.TYPE_CHARACTER
})
