import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {Input} from '../../../inputs/Input'
import {Update} from '../../updaters/Update'
import {Entity} from '../../../entity/Entity'

export namespace DestinationMarker {
  export enum State {
    VISIBLE = 'visible'
  }

  export const update: Update = (marker, state) => {
    let status = UpdateStatus.UNCHANGED
    const {pick} = state.inputs
    if (!pick || !pick.active) return status
    const position = Input.levelXY(pick, state.canvasWH, state.level.cam.bounds)
    status |= Entity.setState(marker, State.VISIBLE)
    if (!(status & UpdateStatus.UPDATED)) Entity.resetAnimation(marker)
    const destination = position.add(Entity.imageRect(marker).origin)
    status |= Entity.moveTo(marker, destination)

    return status
  }
}
