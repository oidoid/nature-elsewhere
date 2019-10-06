import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Layer} from '../image/Layer'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'
import {XY} from '../math/XY'
import {Rect} from '../math/Rect'

export class Bush extends Entity<Bush.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Bush.State>) {
    super({
      type: EntityType.SCENERY_BUSH,
      state: Bush.State.VISIBLE,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Bush.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.SCENERY_BUSH}),
            new Image(atlas, {
              id: AtlasID.SCENERY_BUSH_SHADOW,
              position: new XY(0, 1),
              layer: Layer.SHADOW
            })
          ]
        })
      },
      collisionBodies: [Rect.make(2, 5, 3, 2)],
      collisionType: CollisionType.TYPE_SCENERY | CollisionType.IMPEDIMENT,
      ...props
    })
  }
}

export namespace Bush {
  export enum State {
    VISIBLE = 'visible'
  }
}
