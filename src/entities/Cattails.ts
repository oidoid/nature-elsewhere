import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'

export class Cattails extends Entity<Cattails.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Cattails.State>) {
    super({
      type: EntityType.SCENERY_CATTAILS,
      state: Cattails.State.VISIBLE,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Cattails.State.VISIBLE]: new ImageRect({
          images: [new Image(atlas, {id: AtlasID.SCENERY_CATTAILS})]
        })
      },
      collisionType: CollisionType.TYPE_SCENERY,
      ...props
    })
  }
}

export namespace Cattails {
  export enum State {
    VISIBLE = 'visible'
  }
}
