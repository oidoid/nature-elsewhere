import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {Input} from '../inputs/Input'
import {Entity} from '../entity/Entity'
import {UpdateState} from '../updaters/UpdateState'
import {EntityType} from '../entity/EntityType'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {CollisionType} from '../collision/CollisionType'
import {XY} from '../math/XY'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'

export class DestinationMarker extends Entity<'none', DestinationMarker.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<'none', DestinationMarker.State>
  ) {
    super({
      type: EntityType.UI_DESTINATION_MARKER,
      variant: 'none',
      state: Entity.BaseState.HIDDEN,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [DestinationMarker.State.VISIBLE]: new ImageRect({
          origin: new XY(-2, -1),
          images: [new Image(atlas, {id: AtlasID.UI_DESTINATION_MARKER})]
        })
      },
      updatePredicate: UpdatePredicate.ALWAYS,
      collisionType: CollisionType.TYPE_UI,
      ...props
    })
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)

    const {pick} = state.inputs
    if (!pick || !pick.active) return status
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
}

export namespace DestinationMarker {
  export enum State {
    VISIBLE = 'visible'
  }
}
