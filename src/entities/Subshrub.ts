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
import {ObjectUtil} from '../utils/ObjectUtil'

export class Subshrub extends Entity<Subshrub.Variant, Subshrub.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Subshrub.Variant, Subshrub.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Subshrub.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.SUBSHRUB}),
            new Image(atlas, {
              id: AtlasID.SUBSHRUB_SHADOW,
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

export namespace Subshrub {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.SUBSHRUB,
  variant: Subshrub.Variant.NONE,
  state: Subshrub.State.VISIBLE,
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.IMPEDIMENT
})
