import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'

export class IsoGrass extends Entity {
  constructor(atlas: Atlas, props?: Entity.Props) {
    super({
      type: EntityType.SCENERY_ISO_GRASS,
      state: IsoGrassState.NE,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [IsoGrassState.NE]: new ImageRect({
          images: [new Image(atlas, {id: AtlasID.SCENERY_ISO_GRASS})]
        })
      },
      collisionType: CollisionType.TYPE_SCENERY,
      ...props
    })
  }
}

export enum IsoGrassState {
  NE = 'ne'
}
