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

export class Path extends Entity<Path.Variant, Path.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Path.Variant, Path.State>) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Path.State.VISIBLE]: new ImageRect({
          images: variantImages(
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

function variantImages(atlas: Atlas, variant: Path.Variant): Image[] {
  switch (variant) {
    case Path.Variant.STRAIGHT_NE:
      return [
        Image.withAtlasSize(atlas, {
          id: AtlasID.PATH_NE,
          layer: Layer.ABOVE_PLANE
        })
      ]
    case Path.Variant.STRAIGHT_NW:
      return [
        Image.withAtlasSize(atlas, {
          id: AtlasID.PATH_NE,
          layer: Layer.ABOVE_PLANE,
          sx: -1
        })
      ]
    case Path.Variant.CORNER_E:
      return [
        Image.withAtlasSize(atlas, {
          id: AtlasID.PATH_CORNER_E,
          layer: Layer.ABOVE_PLANE
        })
      ]
    case Path.Variant.CORNER_W:
      return [
        Image.withAtlasSize(atlas, {
          id: AtlasID.PATH_CORNER_E,
          layer: Layer.ABOVE_PLANE,
          sx: -1
        })
      ]
    case Path.Variant.CORNER_N:
      return [
        Image.withAtlasSize(atlas, {
          id: AtlasID.PATH_CORNER_N,
          layer: Layer.ABOVE_PLANE
        })
      ]
    case Path.Variant.CORNER_S:
      return [
        Image.withAtlasSize(atlas, {
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
