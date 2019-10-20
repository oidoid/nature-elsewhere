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
import {Rect} from '../math/Rect'

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
            Image.withAtlasSize(atlas, {id: AtlasID.MOUNTAIN}),
            Image.withAtlasSize(atlas, {
              id: AtlasID.MOUNTAIN_SHADOW,
              x: -2,
              y: 1,
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

export namespace Mountain {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = Object.freeze({
  type: EntityType.MOUNTAIN,
  variant: Mountain.Variant.NONE,
  state: Mountain.State.VISIBLE,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: Object.freeze([Object.freeze(Rect.make(0, 5, 13, 4))]),
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE
})
