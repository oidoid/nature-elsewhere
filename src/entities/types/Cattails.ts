import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entity/EntityType'
import {ImageRect} from '../../imageStateMachine/ImageRect'
import {Image} from '../../image/Image'
import {AtlasID} from '../../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../../collision/CollisionType'

export class Cattails extends Entity {
  constructor(atlas: Atlas, props?: Entity.Props) {
    super({
      type: EntityType.SCENERY_CATTAILS,
      state: CattailsState.VISIBLE,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [CattailsState.VISIBLE]: new ImageRect({
          images: [new Image(atlas, {id: AtlasID.SCENERY_CATTAILS})]
        })
      },
      collisionType: CollisionType.TYPE_SCENERY,
      ...props
    })
  }
}

export enum CattailsState {
  VISIBLE = 'visible'
}
