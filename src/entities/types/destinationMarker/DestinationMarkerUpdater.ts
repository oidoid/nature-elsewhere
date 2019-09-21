import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {XY} from '../../../math/xy/XY'
import {Input} from '../../../inputs/Input'
import {Update} from '../../updaters/Update'
import {DestinationMarkerState} from './DestinationMarkerState'
import {EntityUtil} from '../../entity/EntityUtil'

export namespace DestinationMarkerUpdater {
  export const update: Update = (marker, state) => {
    let status = UpdateStatus.UNCHANGED
    const {pick} = state.inputs
    if (!pick || !pick.active) return status
    const position = XY.trunc(
      Input.levelXY(pick, state.canvasWH, state.level.cam.bounds)
    )
    status |= EntityUtil.setState(marker, DestinationMarkerState.VISIBLE)
    EntityUtil.resetAnimation(marker)
    const destination = XY.add(position, EntityUtil.imageState(marker).origin)
    status |= EntityUtil.moveTo(marker, destination)

    return status
  }
}
