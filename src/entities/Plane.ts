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

export class Plane extends Entity<Plane.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Plane.State>) {
    super({
      type: EntityType.SCENERY_SUBSHRUB,
      state: Entity.BaseState.HIDDEN,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Plane.State.GRID]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.UI_GRID,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.GRID
            })
          ]
        }),
        [Plane.State.TRANSPARENT]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_TRANSPARENT,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [Plane.State.WHITE]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_WHITE,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [Plane.State.PALE_GREEN]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_PALE_GREEN,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [Plane.State.LIGHT_GREEN]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_LIGHT_GREEN,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [Plane.State.GREEN]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_GREEN,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [Plane.State.DARK_GREEN]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_DARK_GREEN,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [Plane.State.BLACK]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_BLACK,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [Plane.State.GREY]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_GREY,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [Plane.State.BLUE]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_BLUE,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [Plane.State.LIGHT_BLUE]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_LIGHT_BLUE,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [Plane.State.RED]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_RED,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [Plane.State.ORANGE]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_ORANGE,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [Plane.State.LIGHT_GREY]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_LIGHT_GREY,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
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
  export enum State {
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
}
