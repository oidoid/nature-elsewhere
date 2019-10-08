import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Layer} from '../image/Layer'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'

export class Subshrub extends Entity<'none', Subshrub.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<'none', Subshrub.State>) {
    super({
      type: EntityType.SCENERY_SUBSHRUB,
      variant: 'none',
      state: Subshrub.State.VISIBLE,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Subshrub.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.SCENERY_SUBSHRUB}),
            new Image(atlas, {
              id: AtlasID.SCENERY_SUBSHRUB_SHADOW,
              layer: Layer.SHADOW
            })
          ]
        })
      },
      collisionType: CollisionType.TYPE_SCENERY | CollisionType.IMPEDIMENT,
      ...props
    })
  }
}

export namespace Subshrub {
  export enum State {
    VISIBLE = 'visible'
  }
}
