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
import {Rect} from '../math/Rect'

export class Bush extends Entity<Bush.Variant, Bush.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Bush.Variant, Bush.State>) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Bush.State.VISIBLE]: new ImageRect({
          images: [
            Image.new(atlas, {id: AtlasID.BUSH}),
            Image.new(atlas, {
              id: AtlasID.BUSH_SHADOW,
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

export namespace Bush {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = Object.freeze({
  type: EntityType.BUSH,
  variant: Bush.Variant.NONE,
  state: Bush.State.VISIBLE,
  collisionBodies: Object.freeze([Object.freeze(Rect.make(2, 5, 3, 2))]),
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.IMPEDIMENT
})
