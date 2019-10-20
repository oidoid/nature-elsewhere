import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue} from '../utils/JSON'

export class Cattails extends Entity<Cattails.Variant, Cattails.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Cattails.Variant, Cattails.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Cattails.State.VISIBLE]: new ImageRect({
          images: [Image.withAtlasSize(atlas, {id: AtlasID.CATTAILS})]
        })
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Cattails {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = Object.freeze({
  type: EntityType.CATTAILS,
  variant: Cattails.Variant.NONE,
  state: Cattails.State.VISIBLE,
  collisionType: CollisionType.TYPE_SCENERY
})
