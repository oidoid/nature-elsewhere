import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'
import {Rect} from '../math/Rect'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {UpdatePredicate} from '../updaters/UpdatePredicate'
import {UpdateStatus} from '../updaters/UpdateStatus'

export class Bee extends Entity<Bee.Variant, Bee.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Bee.Variant, Bee.State>) {
    super({
      ...defaults,
      collisionType: defaults.collisionType[props?.state ?? defaults.state],
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Bee.State.IDLE]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {id: AtlasID.BEE}),
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.BEE_SHADOW,
              layer: Layer.SHADOW
            })
          ]
        }),
        [Bee.State.DEAD]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {id: AtlasID.BEE_DEAD}),
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.BEE_BLOOD,
              layer: Layer.BLOOD
            })
          ]
        })
      },
      ...props
    })
  }

  transition(state: Bee.State): UpdateStatus {
    const status = super.transition(state)
    this.collisionType = defaults.collisionType[state]
    return status
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, {
      ...defaults,
      collisionType: defaults.collisionType[this.state]
    })
  }
}

export namespace Bee {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    IDLE = 'idle',
    DEAD = 'dead'
  }
}

const defaults = Object.freeze({
  type: EntityType.BEE,
  variant: Bee.Variant.NONE,
  state: Bee.State.IDLE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  collisionType: {
    [Bee.State.IDLE]: CollisionType.TYPE_CHARACTER | CollisionType.HARMFUL,
    [Bee.State.DEAD]: CollisionType.TYPE_CHARACTER | CollisionType.TYPE_ITEM
  },
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: Object.freeze([Object.freeze(Rect.make(1, 1, 3, 2))])
})
