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
import {UpdatePredicate} from '../updaters/UpdatePredicate'

export class Bunny extends Entity<Bunny.Variant, Bunny.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Bunny.Variant, Bunny.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Bunny.State.IDLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.BUNNY}),
            new Image(atlas, {
              id: AtlasID.BUNNY_SHADOW,
              layer: Layer.SHADOW,
              x: 0,
              y: 1
            })
          ]
        }),
        [Bunny.State.DEAD]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.BUNNY_DEAD}),
            new Image(atlas, {id: AtlasID.BUNNY_BLOOD, layer: Layer.BLOOD})
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

export namespace Bunny {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    IDLE = 'idle',
    DEAD = 'dead'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.BUNNY,
  variant: Bunny.Variant.NONE,
  state: Bunny.State.IDLE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  collisionType: CollisionType.TYPE_CHARACTER | CollisionType.IMPEDIMENT,
  collisionPredicate: CollisionPredicate.BODIES
})
