import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdaterType} from '../updaters/updaterType/UpdaterType'
import {CollisionType} from '../collision/CollisionType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {Layer} from '../image/Layer'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {XY} from '../math/XY'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

export class Fly extends Entity<Fly.Variant, Fly.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Fly.Variant, Fly.State>) {
    super({
      ...defaults,
      updaters: [...defaults.updaters],
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Fly.State.IDLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.PALETTE_GREY}),
            new Image(atlas, {
              id: AtlasID.PALETTE_LIGHT_GREY,
              position: new XY(0, 2),
              layer: Layer.SHADOW
            })
          ]
        }),
        [Fly.State.DEAD]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.PALETTE_RED, layer: Layer.BLOOD})
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

export namespace Fly {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    IDLE = 'idle',
    DEAD = 'dead'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.CHAR_FLY,
  state: Fly.State.IDLE,
  variant: Fly.Variant.NONE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  updaters: [UpdaterType.CIRCLE],
  collisionType: CollisionType.TYPE_CHARACTER
})
