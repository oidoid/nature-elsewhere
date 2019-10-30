import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntityConfig} from '../entity/EntityConfig'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Layer} from '../sprite/Layer'
import {Rect} from '../math/Rect'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'

export class Bush extends Entity<Bush.Variant, Bush.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Bush.Variant, Bush.State>) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Bush.State.NONE]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {id: AtlasID.BUSH}),
            Sprite.withAtlasSize(atlas, {
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

  toJSON(): EntityConfig {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Bush {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    NONE = 'none'
  }
}

const defaults = Object.freeze({
  type: EntityType.BUSH,
  variant: Bush.Variant.NONE,
  state: Bush.State.NONE,
  collisionBodies: Object.freeze([Object.freeze(Rect.make(2, 5, 3, 2))]),
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.IMPEDIMENT
})
