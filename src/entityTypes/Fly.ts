import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {UpdatePredicate} from '../entities/updaters/updatePredicate/UpdatePredicate'
import {UpdaterType} from '../entities/updaters/updaterType/UpdaterType'
import {CollisionType} from '../collision/CollisionType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {Layer} from '../image/Layer'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {XY} from '../math/XY'

export class Fly extends Entity {
  constructor(atlas: Atlas, props?: Optional<Entity.Props, 'type'>) {
    super({
      type: EntityType.CHAR_FLY,
      state: FlyState.IDLE,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [FlyState.IDLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.PALETTE_GREY}),
            new Image(atlas, {
              id: AtlasID.PALETTE_LIGHT_GREY,
              position: new XY(0, 2),
              layer: Layer.SHADOW
            })
          ]
        }),
        [FlyState.DEAD]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.PALETTE_RED, layer: Layer.BLOOD})
          ]
        })
      },
      updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
      updaters: [UpdaterType.CIRCLE],
      collisionType: CollisionType.TYPE_CHARACTER,
      ...props
    })
  }
}

export enum FlyState {
  IDLE = 'idle',
  DEAD = 'dead'
}
