import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {XY} from '../../../math/XY'
import {Input} from '../../../inputs/Input'
import {Update} from '../../updaters/Update'
import {DestinationMarkerState} from './DestinationMarkerState'
import {Entity} from '../../../entity/Entity'

export namespace DestinationMarkerUpdater {
  export const update: Update = (marker, state) => {
    let status = UpdateStatus.UNCHANGED
    const {pick} = state.inputs
    if (!pick || !pick.active) return status
    const position = XY.trunc(
      Input.levelXY(pick, state.canvasWH, state.level.cam.bounds)
    )
    status |= Entity.setState(marker, DestinationMarkerState.VISIBLE)
    if (!(status & UpdateStatus.UPDATED)) Entity.resetAnimation(marker)
    const destination = XY.add(position, Entity.imageRect(marker).origin)
    status |= Entity.moveTo(marker, destination)

    return status
  }
}
