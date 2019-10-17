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
import {Limits} from '../math/Limits'
import {ObjectUtil} from '../utils/ObjectUtil'

export class Plane extends Entity<Plane.Variant, Plane.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Plane.Variant, Plane.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Plane.State.VISIBLE]: new ImageRect({
          images: [
            variantImage(atlas, (props && props.variant) || Plane.Variant.BLACK)
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

export namespace Plane {
  // [palette]
  export enum Variant {
    GRID = 'grid',
    TRANSPARENT = 'transparent',
    WHITE = 'white',
    PALE_GREEN = 'paleGreen',
    LIGHT_GREEN = 'lightGreen',
    GREEN = 'green',
    DARK_GREEN = 'darkGreen',
    BLACK = 'black',
    GREY = 'grey',
    BLUE = 'blue',
    LIGHT_BLUE = 'lightBlue',
    RED = 'red',
    ORANGE = 'orange',
    LIGHT_GREY = 'lightGrey'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

function variantImage(atlas: Atlas, variant: Plane.Variant): Image {
  const w = Limits.maxShort
  const h = Limits.maxShort
  switch (variant) {
    case Plane.Variant.GRID:
      return new Image(atlas, {
        id: AtlasID.UI_GRID,
        w,
        h,
        layer: Layer.GRID
      })
    case Plane.Variant.TRANSPARENT:
      return new Image(atlas, {
        id: AtlasID.PALETTE_TRANSPARENT,
        w,
        h,
        layer: Layer.PLANE
      })
    case Plane.Variant.WHITE:
      return new Image(atlas, {
        id: AtlasID.PALETTE_WHITE,
        w,
        h,
        layer: Layer.PLANE
      })
    case Plane.Variant.PALE_GREEN:
      return new Image(atlas, {
        id: AtlasID.PALETTE_PALE_GREEN,
        w,
        h,
        layer: Layer.PLANE
      })
    case Plane.Variant.LIGHT_GREEN:
      return new Image(atlas, {
        id: AtlasID.PALETTE_LIGHT_GREEN,
        w,
        h,
        layer: Layer.PLANE
      })
    case Plane.Variant.GREEN:
      return new Image(atlas, {
        id: AtlasID.PALETTE_GREEN,
        w,
        h,
        layer: Layer.PLANE
      })
    case Plane.Variant.DARK_GREEN:
      return new Image(atlas, {
        id: AtlasID.PALETTE_DARK_GREEN,
        w,
        h,
        layer: Layer.PLANE
      })
    case Plane.Variant.BLACK:
      return new Image(atlas, {
        id: AtlasID.PALETTE_BLACK,
        w,
        h,
        layer: Layer.PLANE
      })
    case Plane.Variant.GREY:
      return new Image(atlas, {
        id: AtlasID.PALETTE_GREY,
        w,
        h,
        layer: Layer.PLANE
      })
    case Plane.Variant.BLUE:
      return new Image(atlas, {
        id: AtlasID.PALETTE_BLUE,
        w,
        h,
        layer: Layer.PLANE
      })
    case Plane.Variant.LIGHT_BLUE:
      return new Image(atlas, {
        id: AtlasID.PALETTE_LIGHT_BLUE,
        w,
        h,
        layer: Layer.PLANE
      })
    case Plane.Variant.RED:
      return new Image(atlas, {
        id: AtlasID.PALETTE_RED,
        w,
        h,
        layer: Layer.PLANE
      })
    case Plane.Variant.ORANGE:
      return new Image(atlas, {
        id: AtlasID.PALETTE_ORANGE,
        w,
        h,
        layer: Layer.PLANE
      })
    case Plane.Variant.LIGHT_GREY:
      return new Image(atlas, {
        id: AtlasID.PALETTE_LIGHT_GREY,
        w,
        h,
        layer: Layer.PLANE
      })
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.SUBSHRUB,
  variant: Plane.Variant.BLACK,
  state: Plane.State.VISIBLE,
  collisionType: CollisionType.TYPE_SCENERY
})
