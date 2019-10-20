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
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Monument.State.VISIBLE]: new ImageRect({
          images: variantImages(atlas, props?.variant ?? defaults.variant)
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
    VISIBLE = 'visible'
  }
}

const defaults = Object.freeze({
  type: EntityType.MONUMENT,
  variant: Monument.Variant.SMALL,
  state: Monument.State.VISIBLE,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: Object.freeze({
    [Monument.Variant.SMALL]: Object.freeze([
      Object.freeze(Rect.make(5, 28, 25, 3)),
      Object.freeze(Rect.make(20, 23, 15, 6))
    ]),
    [Monument.Variant.MEDIUM]: Object.freeze([
      Object.freeze(Rect.make(6, 35, 25, 11)),
      Object.freeze(Rect.make(5, 46, 28, 6))
    ])
  }),
  collisionType: CollisionType.TYPE_SCENERY | CollisionType.OBSTACLE
})

function variantImages(atlas: Atlas, variant: Monument.Variant): Image[] {
  const small = variant === Monument.Variant.SMALL
  return [
    Image.new(atlas, {
      id: small ? AtlasID.MONUMENT_SMALL : AtlasID.MONUMENT_MEDIUM
    }),
    Image.new(atlas, {
      id: small
        ? AtlasID.MONUMENT_SMALL_SHADOW
        : AtlasID.MONUMENT_MEDIUM_SHADOW,
      y: 1,
      layer: Layer.SHADOW
    })
  ]
}
