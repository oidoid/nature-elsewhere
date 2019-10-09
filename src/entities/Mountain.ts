import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {XY} from '../math/XY'
import {Layer} from '../image/Layer'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {Rect} from '../math/Rect'
import {CollisionType} from '../collision/CollisionType'
import {Atlas} from 'aseprite-atlas'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

export class Mountain extends Entity<Mountain.Variant, Mountain.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Mountain.Variant, Mountain.State>
  ) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Mountain.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.SCENERY_MOUNTAIN}),
            new Image(atlas, {
              id: AtlasID.SCENERY_MOUNTAIN_SHADOW,
              position: new XY(-2, 1),
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

export namespace Mountain {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.SCENERY_MOUNTAIN,
  variant: Mountain.Variant.NONE,
  state: Mountain.State.VISIBLE,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: [Rect.make(0, 5, 13, 4)],
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE
})
