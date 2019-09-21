import {UpdateStatus} from '../../updaters/update-status/update-status'
import {XY} from '../../../math/xy/xy'
import {Input} from '../../../inputs/input'
import {EntityState} from '../../entity-state/entity-state'
import {Update} from '../../updaters/update'
import {EntityUtil} from '../../entity/entity-util'
import {CursorState} from './cursor-state'

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
