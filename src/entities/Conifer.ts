import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../image/Layer'
import {ObjectUtil} from '../utils/ObjectUtil'
import {Rect} from '../math/Rect'
import {XY} from '../math/XY'

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
            new Image(atlas, {id: AtlasID.CONIFER}),
            new Image(atlas, {
              id: AtlasID.CONIFER_SHADOW,
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
    return EntitySerializer.serialize(this, defaults)
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
  type: EntityType.CONIFER,
  variant: Conifer.Variant.NONE,
  state: Conifer.State.VISIBLE,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: [Rect.make(2, 9, 3, 3)],
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE
})
