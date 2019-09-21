import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {XY} from '../../../math/xy/XY'
import {Input} from '../../../inputs/Input'
import {EntityState} from '../../entityState/EntityState'
import {Update} from '../../updaters/Update'
import {EntityUtil} from '../../entity/EntityUtil'
import {CursorState} from './CursorState'

export namespace CursorUpdater {
  export const update: Update = (entity, state) => {
    let status = UpdateStatus.UNCHANGED
    let nextState: CursorState | EntityState = EntityState.HIDDEN
    const {point, pick} = state.inputs
    if (pick && pick.active) {
      nextState = CursorState.VISIBLE
      const position = XY.trunc(
        Input.levelXY(pick, state.canvasWH, state.level.cam.bounds)
      )
      status |= EntityUtil.moveTo(entity, position)
    } else if (point && point.active) {
      nextState = CursorState.VISIBLE
      const position = XY.trunc(
        Input.levelXY(point, state.canvasWH, state.level.cam.bounds)
      )
      status |= EntityUtil.moveTo(entity, position)
    }
    status |= EntityUtil.setState(entity, nextState)

    return status
  }
}
