import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../image/Layer'
import {UpdatePredicate} from '../updaters/UpdatePredicate'

export class Fly extends Entity<Fly.Variant, Fly.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Fly.Variant, Fly.State>) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Fly.State.IDLE]: new ImageRect({
          images: [
            Image.new(atlas, {id: AtlasID.PALETTE_GREY}),
            Image.new(atlas, {
              id: AtlasID.PALETTE_LIGHT_GREY,
              y: 2,
              layer: Layer.SHADOW
            })
          ]
        }),
        [Fly.State.DEAD]: new ImageRect({
          images: [
            Image.new(atlas, {id: AtlasID.PALETTE_RED, layer: Layer.BLOOD})
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
