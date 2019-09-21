import {UpdateStatus} from '../../updaters/update-status/update-status'
import {XY} from '../../../math/xy/xy'
import {Input} from '../../../inputs/input'
import {Update} from '../../updaters/update'
import {DestinationMarkerState} from './destination-marker-state'
import {EntityUtil} from '../../entity/entity-util'

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
