import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {Input} from '../../../inputs/Input'
import {Entity} from '../../../entity/Entity'
import {UpdateState} from '../../updaters/UpdateState'

export class DestinationMarker extends Entity {
  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)

    const {pick} = state.inputs
    if (!pick || !pick.active) return status
    const position = Input.levelXY(pick, state.canvasWH, state.level.cam.bounds)
    status |= this.setState(DestinationMarkerState.VISIBLE)
    if (!(status & UpdateStatus.UPDATED)) this.resetAnimation()
    const destination = position.add(this.imageRect().origin)
    status |= this.moveTo(destination)

    return status
  }
}

export enum DestinationMarkerState {
  VISIBLE = 'visible'
}
