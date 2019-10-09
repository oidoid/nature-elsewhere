import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Layer} from '../image/Layer'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'
import {XY} from '../math/XY'
import {Rect} from '../math/Rect'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

export class Bush extends Entity<Bush.Variant, Bush.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Bush.Variant, Bush.State>) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Bush.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.SCENERY_BUSH}),
            new Image(atlas, {
              id: AtlasID.SCENERY_BUSH_SHADOW,
              position: new XY(0, 1),
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

export namespace Bush {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.SCENERY_BUSH,
  variant: Bush.Variant.NONE,
  state: Bush.State.VISIBLE,
  collisionBodies: [Rect.make(2, 5, 3, 2)],
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.IMPEDIMENT
})
