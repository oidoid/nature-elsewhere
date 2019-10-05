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

export class Plane extends Entity {
  constructor(atlas: Atlas, props?: Omit<Entity.Props, 'type'>) {
    super({
      type: EntityType.SCENERY_SUBSHRUB,
      state: PlaneState.TRANSPARENT,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [PlaneState.GRID]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.UI_GRID,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.GRID
            })
          ]
        }),
        [PlaneState.TRANSPARENT]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_TRANSPARENT,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [PlaneState.WHITE]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_WHITE,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [PlaneState.PALE_GREEN]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_PALE_GREEN,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [PlaneState.LIGHT_GREEN]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_LIGHT_GREEN,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [PlaneState.GREEN]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_GREEN,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [PlaneState.DARK_GREEN]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_DARK_GREEN,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [PlaneState.BLACK]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_BLACK,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [PlaneState.GREY]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_GREY,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [PlaneState.BLUE]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_BLUE,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [PlaneState.LIGHT_BLUE]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_LIGHT_BLUE,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [PlaneState.RED]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_RED,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [PlaneState.ORANGE]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_ORANGE,
              size: new WH(Limits.maxShort, Limits.maxShort),
              layer: Layer.PLANE
            })
          ]
        }),
        [PlaneState.LIGHT_GREY]: new ImageRect({
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

// [palette]
export enum PlaneState {
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
