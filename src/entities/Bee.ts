import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdaterType} from '../updaters/updaterType/UpdaterType'
import {CollisionType} from '../collision/CollisionType'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {Rect} from '../math/Rect'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {Layer} from '../image/Layer'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

export class Bee extends Entity<Bee.Variant, Bee.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Bee.Variant, Bee.State>) {
    super({
      ...defaults,
      updaters: [...defaults.updaters],
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Bee.State.IDLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.CHAR_BEE}),
            new Image(atlas, {id: AtlasID.CHAR_BEE_SHADOW, layer: Layer.SHADOW})
          ]
        }),
        [Bee.State.DEAD]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.CHAR_BEE_DEAD}),
            new Image(atlas, {id: AtlasID.CHAR_BEE_BLOOD, layer: Layer.BLOOD})
          ]
        })
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return this._toJSON(defaults)
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

const defaults = ObjectUtil.freeze({
  type: EntityType.CHAR_BEE,
  variant: Bee.Variant.NONE,
  state: Bee.State.IDLE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  updaters: [UpdaterType.WRAPAROUND],
  collisionType: CollisionType.TYPE_CHARACTER | CollisionType.HARMFUL,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: [Rect.make(1, 1, 3, 2)]
})
