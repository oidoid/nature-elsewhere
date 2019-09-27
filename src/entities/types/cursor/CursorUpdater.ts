// move to cursor
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {Input} from '../../../inputs/Input'
import {Update} from '../../updaters/Update'
import {Entity} from '../../../entity/Entity'
import {Cursor} from './Cursor'

export namespace CursorUpdater {
  export const update: Update = (cursor, state) => {
    let status = UpdateStatus.UNCHANGED
    let nextState: Cursor.State | Entity.State = Entity.State.HIDDEN
    const {point, pick} = state.inputs
    if (pick && pick.active) {
      // it would be good to throttle this so precise picking is easier
      nextState = Cursor.State.VISIBLE
      const position = Input.levelXY(
        pick,
        state.canvasWH,
        state.level.cam.bounds
      )
      status |= Entity.moveTo(cursor, position)
    } else if (point && point.active) {
      nextState = Cursor.State.VISIBLE
      const position = Input.levelXY(
        point,
        state.canvasWH,
        state.level.cam.bounds
      )
      status |= Entity.moveTo(cursor, position)
    }
    status |= Entity.setState(cursor, nextState)

    return status
  }
}
