import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'

export class IsoGrass extends Entity<IsoGrass.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<IsoGrass.State>) {
    super({
      type: EntityType.SCENERY_ISO_GRASS,
      state: IsoGrass.State.NE,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [IsoGrass.State.NE]: new ImageRect({
          images: [new Image(atlas, {id: AtlasID.SCENERY_ISO_GRASS})]
        })
      },
      collisionType: CollisionType.TYPE_SCENERY,
      ...props
    })
  }
}

export namespace IsoGrass {
  export enum State {
    NE = 'ne'
  }
}
