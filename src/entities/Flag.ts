import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {XY} from '../math/XY'
import {Layer} from '../image/Layer'
import {Atlas} from 'aseprite-atlas'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {CollisionType} from '../collision/CollisionType'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

export class Flag extends Entity<Flag.Variant, Flag.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Flag.Variant, Flag.State>) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Flag.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.FLAG}),
            new Image(atlas, {
              id: AtlasID.FLAG_SHADOW,
              position: new XY(-1, 1),
              layer: Layer.SHADOW
            })
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

export namespace Flag {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.FLAG,
  variant: Flag.Variant.NONE,
  state: Flag.State.VISIBLE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  collisionType: CollisionType.TYPE_SCENERY
})
