import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Layer} from '../image/Layer'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {Rect} from '../math/Rect'
import {CollisionType} from '../collision/CollisionType'
import {Atlas} from 'aseprite-atlas'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

export class Pyramid extends Entity<Pyramid.Variant, Pyramid.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Pyramid.Variant, Pyramid.State>
  ) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Pyramid.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.SCENERY_PYRAMID}),
            new Image(atlas, {
              id: AtlasID.SCENERY_PYRAMID_SHADOW,
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

export namespace Pyramid {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.SCENERY_PYRAMID,
  variant: Pyramid.Variant.NONE,
  state: Pyramid.State.VISIBLE,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: [
    Rect.make(0, 12, 5, 8),
    Rect.make(5, 9, 20, 14),
    Rect.make(7, 17, 15, 6),
    Rect.make(25, 12, 5, 8)
  ],
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE
})
