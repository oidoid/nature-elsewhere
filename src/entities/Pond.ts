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
import {SpriteComposition} from '../sprite/SpriteComposition'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'

export class Pond extends Entity<Pond.Variant, Pond.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Pond.Variant, Pond.State>) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Pond.State.NONE]: new SpriteRect({
          sprites: [
            Sprite.withConstituentAtlasSize(atlas, {
              id: AtlasID.WATER,
              constituentID: AtlasID.POND,
              composition: SpriteComposition.CONSTITUENT_MASK,
              layer: Layer.ABOVE_PLANE,
              wvx: 12,
              wvy: 12
            }),
            Sprite.withAtlasSize(atlas, {id: AtlasID.CATTAILS, x: 10, y: -5}),
            Sprite.withAtlasSize(atlas, {id: AtlasID.GRASS_01, x: -3, y: -6}),
            Sprite.withAtlasSize(atlas, {id: AtlasID.GRASS_09, x: 20}),
            Sprite.withAtlasSize(atlas, {id: AtlasID.GRASS_10, x: 10, y: 8})
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

export namespace Pond {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    NONE = 'none'
  }
}

const defaults = Object.freeze({
  type: EntityType.POND,
  variant: Pond.Variant.NONE,
  state: Pond.State.NONE,
  collisionType:
    CollisionType.TYPE_SCENERY |
    CollisionType.DEEP_WATER |
    CollisionType.IMPEDIMENT,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: Object.freeze([
    Object.freeze(Rect.make(6, 3, 10, 7)),
    Object.freeze(Rect.make(5, 5, 12, 4))
  ])
})
