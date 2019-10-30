import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntityConfig} from '../entity/EntityConfig'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Layer} from '../sprite/Layer'
import {Limits} from '../math/Limits'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'

export class Plane extends Entity<Plane.Variant, Plane.State> {
  constructor(props?: Entity.SubProps<Plane.Variant, Plane.State>) {
    super({
      ...defaults,
      map: {
        [Plane.State.HIDDEN]: new SpriteRect(),
        [Plane.State.VISIBLE]: new SpriteRect({
          sprites: [
            new Sprite({
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

  toJSON(): EntityConfig {
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
    LIGHT_GREY = 'lightGrey',
    DARK_RED = 'darkRed'
  }

  export enum State {
    HIDDEN = 'hidden',
    VISIBLE = 'visible'
  }
}

const variantToAtlasID: Readonly<Record<
  Plane.Variant,
  AtlasID
>> = Object.freeze({
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
  [Plane.Variant.LIGHT_GREY]: AtlasID.PALETTE_LIGHT_GREY,
  [Plane.Variant.DARK_RED]: AtlasID.PALETTE_DARK_RED
})

const defaults = Object.freeze({
  type: EntityType.SUBSHRUB,
  variant: Plane.Variant.BLACK,
  state: Plane.State.VISIBLE,
  collisionType: CollisionType.TYPE_SCENERY
})
