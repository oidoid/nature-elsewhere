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
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {XY} from '../math/XY'

export class Pig extends Entity<Pig.Variant, Pig.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Pig.Variant, Pig.State>) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Pig.State.IDLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.PIG}),
            new Image(atlas, {
              id: AtlasID.PIG_SHADOW,
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

export namespace Pig {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    IDLE = 'idle'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.PIG,
  variant: Pig.Variant.NONE,
  state: Pig.State.IDLE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  collisionType: CollisionType.TYPE_CHARACTER | CollisionType.OBSTACLE,
  collisionPredicate: CollisionPredicate.BODIES
})
