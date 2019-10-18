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

export class Pond extends Entity<Pond.Variant, Pond.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Pond.Variant, Pond.State>) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Pond.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.POND, layer: Layer.ABOVE_PLANE}),
            new Image(atlas, {id: AtlasID.CATTAILS, x: 10, y: -5}),
            new Image(atlas, {id: AtlasID.GRASS_01, x: -3, y: -6}),
            new Image(atlas, {id: AtlasID.GRASS_09, x: 20, y: 0}),
            new Image(atlas, {id: AtlasID.GRASS_10, x: 10, y: 8})
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
    CollisionType.IMPEDIMENT,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: [Rect.make(6, 3, 10, 7), Rect.make(5, 5, 12, 4)]
})
