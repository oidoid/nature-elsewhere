import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'
import {Rect} from '../math/Rect'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'

export class Monument extends Entity<Monument.Variant, Monument.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Monument.Variant, Monument.State>
  ) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies[
        props?.variant ?? defaults.variant
      ].map(Rect.copy),
      map: {
        [Monument.State.NONE]: new SpriteRect({
          sprites: variantSprites(atlas, props?.variant ?? defaults.variant)
        })
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Monument {
  export enum Variant {
    SMALL = 'small',
    MEDIUM = 'medium'
  }

  export enum State {
    NONE = 'none'
  }
}

const defaults = Object.freeze({
  type: EntityType.MONUMENT,
  variant: Monument.Variant.SMALL,
  state: Monument.State.NONE,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: Object.freeze({
    [Monument.Variant.SMALL]: Object.freeze([
      Object.freeze(Rect.make(1, 28, 29, 3)),
      Object.freeze(Rect.make(20, 23, 14, 6))
    ]),
    [Monument.Variant.MEDIUM]: Object.freeze([
      Object.freeze(Rect.make(6, 35, 25, 11)),
      Object.freeze(Rect.make(5, 46, 28, 6))
    ])
  }),
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE
})

function variantSprites(atlas: Atlas, variant: Monument.Variant): Sprite[] {
  const small = variant === Monument.Variant.SMALL
  return [
    Sprite.withAtlasSize(atlas, {
      id: small ? AtlasID.MONUMENT_SMALL : AtlasID.MONUMENT_MEDIUM
    }),
    Sprite.withAtlasSize(atlas, {
      id: small
        ? AtlasID.MONUMENT_SMALL_SHADOW
        : AtlasID.MONUMENT_MEDIUM_SHADOW,
      y: 1,
      layer: Layer.SHADOW
    })
  ]
}
