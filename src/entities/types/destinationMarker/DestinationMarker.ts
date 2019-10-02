import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {Input} from '../../../inputs/Input'
import {Update} from '../../updaters/Update'

export namespace DestinationMarker {
  export enum State {
    VISIBLE = 'visible'
  }

  export const update: Update = (marker, state) => {
    let status = UpdateStatus.UNCHANGED
    const {pick} = state.inputs
    if (!pick || !pick.active) return status
    const position = Input.levelXY(pick, state.canvasWH, state.level.cam.bounds)
    status |= marker.setState(State.VISIBLE)
    if (!(status & UpdateStatus.UPDATED)) marker.resetAnimation()
    const destination = position.add(marker.imageRect().origin)
    status |= marker.moveTo(destination)

    return status
  }
}
