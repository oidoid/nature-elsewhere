import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'

export class Path extends Entity<Path.Variant, Path.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Path.Variant, Path.State>) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new SpriteRect(),
        [Path.State.VISIBLE]: new SpriteRect({
          sprites: variantSprites(
            atlas,
            props?.variant ?? Path.Variant.STRAIGHT_NE
          )
        })
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Path {
  export enum Variant {
    STRAIGHT_NE = '/',
    STRAIGHT_NW = '\\',
    CORNER_N = '^',
    CORNER_E = '>',
    CORNER_S = 'v',
    CORNER_W = '<'
  }
  export enum State {
    VISIBLE = 'visible'
  }
}

function variantSprites(atlas: Atlas, variant: Path.Variant): Sprite[] {
  switch (variant) {
    case Path.Variant.STRAIGHT_NE:
      return [
        Sprite.withAtlasSize(atlas, {
          id: AtlasID.PATH_NE,
          layer: Layer.ABOVE_PLANE
        })
      ]
    case Path.Variant.STRAIGHT_NW:
      return [
        Sprite.withAtlasSize(atlas, {
          id: AtlasID.PATH_NE,
          layer: Layer.ABOVE_PLANE,
          sx: -1
        })
      ]
    case Path.Variant.CORNER_E:
      return [
        Sprite.withAtlasSize(atlas, {
          id: AtlasID.PATH_CORNER_E,
          layer: Layer.ABOVE_PLANE
        })
      ]
    case Path.Variant.CORNER_W:
      return [
        Sprite.withAtlasSize(atlas, {
          id: AtlasID.PATH_CORNER_E,
          layer: Layer.ABOVE_PLANE,
          sx: -1
        })
      ]
    case Path.Variant.CORNER_N:
      return [
        Sprite.withAtlasSize(atlas, {
          id: AtlasID.PATH_CORNER_N,
          layer: Layer.ABOVE_PLANE
        })
      ]
    case Path.Variant.CORNER_S:
      return [
        Sprite.withAtlasSize(atlas, {
          id: AtlasID.PATH_CORNER_N,
          layer: Layer.ABOVE_PLANE,
          sy: -1
        })
      ]
  }
}

const defaults = Object.freeze({
  type: EntityType.PATH,
  variant: Path.Variant.STRAIGHT_NE,
  state: Path.State.VISIBLE,
  collisionType: CollisionType.TYPE_SCENERY
})
