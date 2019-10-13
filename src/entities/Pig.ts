import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {CollisionType} from '../collision/CollisionType'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {Layer} from '../image/Layer'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'
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
    return this._toJSON(defaults)
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
