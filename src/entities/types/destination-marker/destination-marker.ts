import {Updater} from '../../updaters/updater/updater'
import {Entity} from '../../entity/entity'
import {UpdateStatus} from '../../updaters/update-status/update-status'
import {InputSource} from '../../../inputs/input-source/input-source'
import {InputBit} from '../../../inputs/input-bit/input-bit'

export namespace DestinationMarker {
  export enum State {
    VISIBLE = 'visible'
  }
  export const update: Updater.Update = (marker, state) => {
    const [set] = state.input.combo.slice(-1)
    const pick = set && set[InputSource.POINTER_PICK]

    let status = UpdateStatus.UNCHANGED
    if (pick && pick.bits === InputBit.PICK) {
      status |= Entity.setState(marker, State.VISIBLE)
      Entity.imageState(marker).images.forEach(
        image => ((image.animator.exposure = 0), (image.animator.period = 0))
      )
      status |= Entity.moveTo(marker, pick.xy)
    }

    return status
  }
}
