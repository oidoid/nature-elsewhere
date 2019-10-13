import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Atlas} from 'aseprite-atlas'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

export class Apple extends Entity<Apple.Variant, Apple.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Apple.Variant, Apple.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Apple.State.VISIBLE]: new ImageRect({
          images: [new Image(atlas, {id: AtlasID.PALETTE_RED})]
        })
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return this._toJSON(defaults)
  }
}

export namespace Apple {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.APPLE,
  variant: Apple.Variant.NONE,
  state: Apple.State.VISIBLE,
  collisionPredicate: CollisionPredicate.IMAGES,
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE
})
