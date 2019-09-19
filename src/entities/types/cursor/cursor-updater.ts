import {Updater} from '../../updaters/updater/updater'
import {Entity} from '../../entity/entity'
import {UpdateStatus} from '../../updaters/update-status/update-status'
import {InputSource} from '../../../inputs/input-source/input-source'
import {InputBit} from '../../../inputs/input-bit/input-bit'
import {Cursor} from './cursor'

export namespace CursorUpdater {
  export const update: Updater.Update = (entity, state) => {
    const [set] = state.input.combo.slice(-1)
    const point = set && set[InputSource.POINTER_POINT]
    const pick = set && set[InputSource.POINTER_PICK]

    let nextState = entity.state
    let status = UpdateStatus.UNCHANGED
    if (pick && pick.bits === InputBit.PICK) {
      // nextState = EntityState.HIDDEN
      nextState = Cursor.State.VISIBLE
      status |= Entity.moveTo(entity, pick.xy)
    } else if (point) {
      nextState = Cursor.State.VISIBLE
      status |= Entity.moveTo(entity, point.xy)
    }
    status |= Entity.setState(entity, nextState)

    return status
  }
}
