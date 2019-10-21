import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Input} from '../inputs/Input'
import {JSONValue} from '../utils/JSON'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {UpdatePredicate} from '../updaters/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {XY} from '../math/XY'

export class DestinationMarker extends Entity<
  DestinationMarker.Variant,
  DestinationMarker.State
> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<DestinationMarker.Variant, DestinationMarker.State>
  ) {
    super({
      ...defaults,
      map: {
        [DestinationMarker.State.HIDDEN]: new SpriteRect(),
        [DestinationMarker.State.VISIBLE]: new SpriteRect({
          origin: new XY(2, 1),
          sprites: [
            Sprite.withAtlasSize(atlas, {id: AtlasID.UI_DESTINATION_MARKER})
          ]
        })
      },
      ...props
    })
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)

    const {pick} = state.inputs
    if (!pick?.active) return status
    const position = Input.levelXY(
      pick,
      state.canvasSize,
      state.level.cam.bounds
    )
    status |= this.transition(DestinationMarker.State.VISIBLE)
    if (!(status & UpdateStatus.UPDATED)) this.resetAnimation()
    status |= this.moveTo(position)

    return status
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace DestinationMarker {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    HIDDEN = 'hidden',
    VISIBLE = 'visible'
  }
}

const defaults = Object.freeze({
  type: EntityType.UI_DESTINATION_MARKER,
  variant: DestinationMarker.Variant.NONE,
  state: DestinationMarker.State.HIDDEN,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionType: CollisionType.TYPE_UI
})
