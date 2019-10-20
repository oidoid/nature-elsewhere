import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../image/Layer'
import {UpdatePredicate} from '../updaters/UpdatePredicate'

export class Flag extends Entity<Flag.Variant, Flag.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Flag.Variant, Flag.State>) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Flag.State.VISIBLE]: new ImageRect({
          images: [
            Image.new(atlas, {id: AtlasID.FLAG}),
            Image.new(atlas, {
              id: AtlasID.FLAG_SHADOW,
              x: -1,
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

export namespace Flag {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = Object.freeze({
  type: EntityType.FLAG,
  variant: Flag.Variant.NONE,
  state: Flag.State.VISIBLE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  collisionType: CollisionType.TYPE_SCENERY
})
