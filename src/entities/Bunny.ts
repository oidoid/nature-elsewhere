import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdaterType} from '../updaters/updaterType/UpdaterType'
import {CollisionType} from '../collision/CollisionType'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {Layer} from '../image/Layer'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {XY} from '../math/XY'
import {JSON} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

export class Bunny extends Entity<Bunny.Variant, Bunny.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Bunny.Variant, Bunny.State>
  ) {
    super({
      ...defaults,
      updaters: [...defaults.updaters],
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Bunny.State.IDLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.CHAR_BUNNY}),
            new Image(atlas, {
              id: AtlasID.CHAR_BUNNY_SHADOW,
              layer: Layer.SHADOW,
              position: new XY(0, 1)
            })
          ]
        }),
        [Bunny.State.DEAD]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.CHAR_BUNNY_DEAD}),
            new Image(atlas, {id: AtlasID.CHAR_BUNNY_BLOOD, layer: Layer.BLOOD})
          ]
        })
      },
      ...props
    })
  }

  toJSON(): JSON {
    return this._toJSON(defaults)
  }
}

export namespace Bunny {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    IDLE = 'idle',
    DEAD = 'dead'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.CHAR_BUNNY,
  variant: Bunny.Variant.NONE,
  state: Bunny.State.IDLE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  updaters: [UpdaterType.WRAPAROUND],
  collisionType: CollisionType.TYPE_CHARACTER | CollisionType.IMPEDIMENT,
  collisionPredicate: CollisionPredicate.BODIES
})
