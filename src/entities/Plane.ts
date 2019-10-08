import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Layer} from '../image/Layer'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'
import {Limits} from '../math/Limits'
import {WH} from '../math/WH'

export class Plane extends Entity<Plane.Variant, Plane.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Plane.Variant, Plane.State>
  ) {
    super({
      type: EntityType.SCENERY_SUBSHRUB,
      variant: Plane.Variant.BLACK,
      state: Plane.State.VISIBLE,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Plane.State.VISIBLE]: new ImageRect({
          images: [
            variantImage(atlas, (props && props.variant) || Plane.Variant.BLACK)
          ]
        })
      },
      collisionType: CollisionType.TYPE_SCENERY,
      ...props
    })
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
  switch (variant) {
    case Plane.Variant.GRID:
      return new Image(atlas, {
        id: AtlasID.UI_GRID,
        size: new WH(Limits.maxShort, Limits.maxShort),
        layer: Layer.GRID
      })
    case Plane.Variant.TRANSPARENT:
      return new Image(atlas, {
        id: AtlasID.PALETTE_TRANSPARENT,
        size: new WH(Limits.maxShort, Limits.maxShort),
        layer: Layer.PLANE
      })
    case Plane.Variant.WHITE:
      return new Image(atlas, {
        id: AtlasID.PALETTE_WHITE,
        size: new WH(Limits.maxShort, Limits.maxShort),
        layer: Layer.PLANE
      })
    case Plane.Variant.PALE_GREEN:
      return new Image(atlas, {
        id: AtlasID.PALETTE_PALE_GREEN,
        size: new WH(Limits.maxShort, Limits.maxShort),
        layer: Layer.PLANE
      })
    case Plane.Variant.LIGHT_GREEN:
      return new Image(atlas, {
        id: AtlasID.PALETTE_LIGHT_GREEN,
        size: new WH(Limits.maxShort, Limits.maxShort),
        layer: Layer.PLANE
      })
    case Plane.Variant.GREEN:
      return new Image(atlas, {
        id: AtlasID.PALETTE_GREEN,
        size: new WH(Limits.maxShort, Limits.maxShort),
        layer: Layer.PLANE
      })
    case Plane.Variant.DARK_GREEN:
      return new Image(atlas, {
        id: AtlasID.PALETTE_DARK_GREEN,
        size: new WH(Limits.maxShort, Limits.maxShort),
        layer: Layer.PLANE
      })
    case Plane.Variant.BLACK:
      return new Image(atlas, {
        id: AtlasID.PALETTE_BLACK,
        size: new WH(Limits.maxShort, Limits.maxShort),
        layer: Layer.PLANE
      })
    case Plane.Variant.GREY:
      return new Image(atlas, {
        id: AtlasID.PALETTE_GREY,
        size: new WH(Limits.maxShort, Limits.maxShort),
        layer: Layer.PLANE
      })
    case Plane.Variant.BLUE:
      return new Image(atlas, {
        id: AtlasID.PALETTE_BLUE,
        size: new WH(Limits.maxShort, Limits.maxShort),
        layer: Layer.PLANE
      })
    case Plane.Variant.LIGHT_BLUE:
      return new Image(atlas, {
        id: AtlasID.PALETTE_LIGHT_BLUE,
        size: new WH(Limits.maxShort, Limits.maxShort),
        layer: Layer.PLANE
      })
    case Plane.Variant.RED:
      return new Image(atlas, {
        id: AtlasID.PALETTE_RED,
        size: new WH(Limits.maxShort, Limits.maxShort),
        layer: Layer.PLANE
      })
    case Plane.Variant.ORANGE:
      return new Image(atlas, {
        id: AtlasID.PALETTE_ORANGE,
        size: new WH(Limits.maxShort, Limits.maxShort),
        layer: Layer.PLANE
      })
    case Plane.Variant.LIGHT_GREY:
      return new Image(atlas, {
        id: AtlasID.PALETTE_LIGHT_GREY,
        size: new WH(Limits.maxShort, Limits.maxShort),
        layer: Layer.PLANE
      })
  }
}
