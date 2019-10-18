import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Input} from '../inputs/Input'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'
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
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [DestinationMarker.State.VISIBLE]: new ImageRect({
          origin: new XY(-2, -1),
          images: [new Image(atlas, {id: AtlasID.UI_DESTINATION_MARKER})]
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
    const destination = position.add(this.origin())
    status |= this.moveTo(destination)

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
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.UI_DESTINATION_MARKER,
  variant: DestinationMarker.Variant.NONE,
  state: Entity.BaseState.HIDDEN,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionType: CollisionType.TYPE_UI
})
