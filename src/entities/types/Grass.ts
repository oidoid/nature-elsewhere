import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entity/EntityType'
import {ImageRect} from '../../imageStateMachine/ImageRect'
import {Image} from '../../image/Image'
import {AtlasID} from '../../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../../collision/CollisionType'
import {XY} from '../../math/XY'

export class Grass extends Entity {
  constructor(atlas: Atlas, props?: Entity.Props) {
    super({
      type: EntityType.SCENERY_GRASS,
      state: GrassState.SMALL,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [GrassState.SMALL]: new ImageRect({
          images: [new Image(atlas, {id: AtlasID.SCENERY_GRASS_0})]
        }),
        [GrassState.MEDIUM]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.SCENERY_GRASS_1}),
            new Image(atlas, {
              id: AtlasID.SCENERY_GRASS_3,
              position: new XY(4, 1)
            })
          ]
        }),
        [GrassState.LARGE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.SCENERY_GRASS_2}),
            new Image(atlas, {
              id: AtlasID.SCENERY_GRASS_0,
              position: new XY(6, 2)
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_GRASS_1,
              position: new XY(3, 3)
            })
          ]
        })
      },
      collisionType: CollisionType.TYPE_SCENERY,
      ...props
    })
  }
}

export enum GrassState {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}
