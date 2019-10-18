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
            new Image(atlas, {
              id: variantToAtlasID[props?.variant ?? Plane.Variant.BLACK],
              w: Limits.maxShort,
              h: Limits.maxShort,
              layer: Layer.PLANE
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

const variantToAtlasID: Readonly<Record<
  Plane.Variant,
  AtlasID
>> = ObjectUtil.freeze({
  [Plane.Variant.GRID]: AtlasID.UI_GRID,
  [Plane.Variant.TRANSPARENT]: AtlasID.PALETTE_TRANSPARENT,
  [Plane.Variant.WHITE]: AtlasID.PALETTE_WHITE,
  [Plane.Variant.PALE_GREEN]: AtlasID.PALETTE_PALE_GREEN,
  [Plane.Variant.LIGHT_GREEN]: AtlasID.PALETTE_LIGHT_GREEN,
  [Plane.Variant.GREEN]: AtlasID.PALETTE_GREEN,
  [Plane.Variant.DARK_GREEN]: AtlasID.PALETTE_DARK_GREEN,
  [Plane.Variant.BLACK]: AtlasID.PALETTE_BLACK,
  [Plane.Variant.GREY]: AtlasID.PALETTE_GREY,
  [Plane.Variant.BLUE]: AtlasID.PALETTE_BLUE,
  [Plane.Variant.LIGHT_BLUE]: AtlasID.PALETTE_LIGHT_BLUE,
  [Plane.Variant.RED]: AtlasID.PALETTE_RED,
  [Plane.Variant.ORANGE]: AtlasID.PALETTE_ORANGE,
  [Plane.Variant.LIGHT_GREY]: AtlasID.PALETTE_LIGHT_GREY
})

const defaults = ObjectUtil.freeze({
  type: EntityType.SUBSHRUB,
  variant: Plane.Variant.BLACK,
  state: Plane.State.VISIBLE,
  collisionType: CollisionType.TYPE_SCENERY
})
