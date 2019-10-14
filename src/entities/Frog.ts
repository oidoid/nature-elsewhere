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
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {XY} from '../math/XY'

export class Frog extends Entity<Frog.Variant, Frog.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Frog.Variant, Frog.State>) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Frog.State.IDLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.FROG_IDLE}),
            new Image(atlas, {
              id: AtlasID.FROG_IDLE_SHADOW,
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
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Frog {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    IDLE = 'idle'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.FROG,
  state: Frog.State.IDLE,
  variant: Frog.Variant.NONE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  collisionType: CollisionType.TYPE_CHARACTER | CollisionType.OBSTACLE,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: [Rect.make(1, 14, 6, 2)]
})
