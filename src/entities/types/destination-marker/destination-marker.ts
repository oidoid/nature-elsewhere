import {Updater} from '../../updaters/updater/updater'
import {Entity} from '../../entity/entity'
import {UpdateStatus} from '../../updaters/update-status/update-status'
import {XY} from '../../../math/xy/xy'
import {Input} from '../../../inputs/input'

export namespace DestinationMarker {
  export enum State {
    VISIBLE = 'visible'
  }
  export const update: Updater.Update = (marker, state) => {
    let status = UpdateStatus.UNCHANGED
    const {pick} = state.inputs
    if (!pick || !pick.active) return status
    const position = XY.trunc(
      Input.levelXY(pick, state.canvasWH, state.level.cam.bounds)
    )
    status |= Entity.setState(marker, State.VISIBLE)
    Entity.resetAnimation(marker)
    const destination = XY.add(position, Entity.imageState(marker).origin)
    status |= Entity.moveTo(marker, destination)

    return status
  }
}
