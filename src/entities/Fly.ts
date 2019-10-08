import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdaterType} from '../updaters/updaterType/UpdaterType'
import {CollisionType} from '../collision/CollisionType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {Layer} from '../image/Layer'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {XY} from '../math/XY'

export class Fly extends Entity<'none', Fly.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<'none', Fly.State>) {
    super({
      type: EntityType.CHAR_FLY,
      state: Fly.State.IDLE,
      variant: 'none',
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Fly.State.IDLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.PALETTE_GREY}),
            new Image(atlas, {
              id: AtlasID.PALETTE_LIGHT_GREY,
              position: new XY(0, 2),
              layer: Layer.SHADOW
            })
          ]
        }),
        [Fly.State.DEAD]: new ImageRect({
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

export namespace Fly {
  export enum State {
    IDLE = 'idle',
    DEAD = 'dead'
  }
}
