import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entity/EntityType'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdaterType} from '../updaters/updaterType/UpdaterType'
import {CollisionType} from '../../collision/CollisionType'
import {CollisionPredicate} from '../../collision/CollisionPredicate'
import {ImageRect} from '../../imageStateMachine/ImageRect'
import {Image} from '../../image/Image'
import {Layer} from '../../image/Layer'
import {AtlasID} from '../../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {XY} from '../../math/XY'

export class Bunny extends Entity {
  constructor(atlas: Atlas, props?: Entity.Props) {
    super({
      type: EntityType.CHAR_BUNNY,
      state: BunnyState.IDLE,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [BunnyState.IDLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.CHAR_BUNNY}),
            new Image(atlas, {
              id: AtlasID.CHAR_BUNNY_SHADOW,
              layer: Layer.SHADOW,
              position: new XY(0, 1)
            })
          ]
        }),
        [BunnyState.DEAD]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.CHAR_BUNNY_DEAD}),
            new Image(atlas, {id: AtlasID.CHAR_BUNNY_BLOOD, layer: Layer.BLOOD})
          ]
        })
      },
      updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
      updaters: [UpdaterType.WRAPAROUND],
      collisionType: CollisionType.TYPE_CHARACTER | CollisionType.IMPEDIMENT,
      collisionPredicate: CollisionPredicate.BODIES,
      ...props
    })
  }
}

export enum BunnyState {
  IDLE = 'idle',
  DEAD = 'dead'
}
