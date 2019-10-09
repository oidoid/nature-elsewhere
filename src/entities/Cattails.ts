import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

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
          images: [new Image(atlas, {id: AtlasID.CATTAILS})]
        })
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return this._toJSON(defaults)
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

const defaults = ObjectUtil.freeze({
  type: EntityType.CATTAILS,
  variant: Cattails.Variant.NONE,
  state: Cattails.State.VISIBLE,
  collisionType: CollisionType.TYPE_SCENERY
})
