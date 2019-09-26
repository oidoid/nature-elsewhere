import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {XY} from '../../../math/XY'
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
      nextState = Cursor.State.VISIBLE
      const position = XY.trunc(
        Input.levelXY(pick, state.canvasWH, state.level.cam.bounds)
      )
      status |= Entity.moveTo(cursor, position)
    } else if (point && point.active) {
      nextState = Cursor.State.VISIBLE
      const position = XY.trunc(
        Input.levelXY(point, state.canvasWH, state.level.cam.bounds)
      )
      status |= Entity.moveTo(cursor, position)
    }
    status |= Entity.setState(cursor, nextState)

    return status
  }
}
