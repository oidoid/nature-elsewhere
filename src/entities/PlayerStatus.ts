import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {UpdatePredicate} from '../updaters/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {XY} from '../math/XY'

export class PlayerStatus extends Entity<
  PlayerStatus.Variant,
  PlayerStatus.State
> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<PlayerStatus.Variant, PlayerStatus.State>
  ) {
    super({
      ...defaults,
      map: {
        [PlayerStatus.State.IDLE]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.PLAYER_STATUS_IDLE,
              layer: Layer.UI_HIHI
            })
          ]
        }),
        [PlayerStatus.State.WALK]: new SpriteRect({
          sprites: [
            Sprite.withAtlasSize(atlas, {
              id: AtlasID.PLAYER_STATUS_WALK,
              layer: Layer.UI_HIHI
            })
          ]
        })
      },
      ...props
    })
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)
    const nextState = state.level.player?.idle
      ? PlayerStatus.State.IDLE
      : PlayerStatus.State.WALK
    // Avoid direction changes. Limit updates to non-idle states when there's
    // horizontal velocity.
    if (!state.level.player?.idle && state.level.player?.velocity.x)
      status |= this.scaleTo(
        new XY(state.level.player.velocity.x < 0 ? -1 : 1, 1)
      )
    status |= this.transition(nextState)
    return status
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace PlayerStatus {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    IDLE = 'idle',
    WALK = 'walk'
  }
}

const defaults = Object.freeze({
  type: EntityType.PLAYER_STATUS,
  state: PlayerStatus.State.IDLE,
  variant: PlayerStatus.Variant.NONE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  collisionType: CollisionType.TYPE_CHARACTER
})
