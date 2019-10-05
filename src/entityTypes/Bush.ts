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

export class Bush extends Entity {
  constructor(atlas: Atlas, props?: Entity.Props) {
    super({
      type: EntityType.SCENERY_BUSH,
      state: BushState.VISIBLE,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [BushState.VISIBLE]: new ImageRect({
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

export enum BushState {
  VISIBLE = 'visible'
}
