import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'
import {Layer} from '../image/Layer'
import {XY} from '../math/XY'

export class Clover extends Entity {
  constructor(atlas: Atlas, props?: Optional<Entity.Props, 'type'>) {
    super({
      type: EntityType.SCENERY_CLOVER,
      state: CloverState.SMALL,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [CloverState.SMALL]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOVER_0x0,
              layer: Layer.DECAL
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOVER_0x1,
              position: new XY(1, 3),
              layer: Layer.DECAL
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOVER_0x0,
              position: new XY(4, 1),
              layer: Layer.DECAL
            })
          ]
        }),
        [CloverState.MEDIUM]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOVER_1x0,
              layer: Layer.DECAL
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOVER_0x1,
              position: new XY(1, 3),
              layer: Layer.DECAL
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOVER_1x0,
              position: new XY(4, 1),
              layer: Layer.DECAL
            })
          ]
        })
      },
      collisionType: CollisionType.TYPE_SCENERY,
      ...props
    })
  }
}

export enum CloverState {
  SMALL = 'small',
  MEDIUM = 'medium'
}
