import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Layer} from '../image/Layer'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'
import {XY} from '../math/XY'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

export class Pond extends Entity<Pond.Variant, Pond.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Pond.Variant, Pond.State>) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Pond.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.POND,
              layer: Layer.ABOVE_PLANE
            }),
            new Image(atlas, {
              id: AtlasID.CATTAILS,
              position: new XY(15, -3)
            }),
            new Image(atlas, {
              id: AtlasID.GRASS_1,
              position: new XY(1, 4)
            }),
            new Image(atlas, {
              id: AtlasID.GRASS_2,
              position: new XY(12, 11)
            }),
            new Image(atlas, {
              id: AtlasID.GRASS_6,
              position: new XY(24, 4)
            }),
            new Image(atlas, {
              id: AtlasID.GRASS_8,
              position: new XY(26, 6)
            }),
            new Image(atlas, {
              id: AtlasID.GRASS_9,
              position: new XY(11, -1)
            }),
            new Image(atlas, {
              id: AtlasID.GRASS_10,
              position: new XY(6, 10)
            }),
            new Image(atlas, {
              id: AtlasID.GRASS_5,
              position: new XY(21, 10)
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

export namespace Pond {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.POND,
  variant: Pond.Variant.NONE,
  state: Pond.State.VISIBLE,
  collisionType:
    CollisionType.TYPE_SCENERY |
    CollisionType.DEEP_WATER |
    CollisionType.IMPEDIMENT
})
