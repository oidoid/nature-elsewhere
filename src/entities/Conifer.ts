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
import {JSON} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

export class Conifer extends Entity<Conifer.Variant, Conifer.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Conifer.Variant, Conifer.State>
  ) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Conifer.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.SCENERY_CONIFER}),
            new Image(atlas, {
              id: AtlasID.SCENERY_CONIFER_SHADOW,
              position: new XY(0, 1),
              layer: Layer.SHADOW
            })
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

export namespace Conifer {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.SCENERY_CONIFER,
  variant: Conifer.Variant.NONE,
  state: Conifer.State.VISIBLE,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: [Rect.make(2, 9, 3, 3)],
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE
})
