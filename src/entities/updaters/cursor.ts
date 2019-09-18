import {Updater} from './updater'
import {Entity} from '../entity'
import {UpdateStatus} from './update-status'
import {InputSource} from '../../inputs/input-source'
import {InputBit} from '../../inputs/input-bit'

export namespace Cursor {
  export enum State {
    VISIBLE = 'visible'
  }
  export const update: Updater.Update = (entity, state) => {
    const [set] = state.input.combo.slice(-1)
    const point = set && set[InputSource.POINTER_POINT]
    const pick = set && set[InputSource.POINTER_PICK]

    let nextState = entity.state
    let status = UpdateStatus.UNCHANGED
    if (pick && pick.bits === InputBit.PICK) {
      // nextState = EntityState.HIDDEN
      nextState = State.VISIBLE
      status |= Entity.moveTo(entity, pick.xy)
    } else if (point) {
      nextState = State.VISIBLE
      status |= Entity.moveTo(entity, point.xy)
    }
    status |= Entity.setState(entity, nextState)

    return status
  }
}
