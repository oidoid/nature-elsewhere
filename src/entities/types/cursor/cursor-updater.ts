import {Updater} from '../../updaters/updater/updater'
import {Entity} from '../../entity/entity'
import {UpdateStatus} from '../../updaters/update-status/update-status'
import {Cursor} from './cursor'
import {XY} from '../../../math/xy/xy'
import {Input} from '../../../inputs/input'
import {EntityState} from '../../entity-state/entity-state'

export namespace CursorUpdater {
  export const update: Updater.Update = (entity, state) => {
    let status = UpdateStatus.UNCHANGED
    let nextState: Cursor.State | EntityState = EntityState.HIDDEN
    const {point, pick} = state.inputs
    if (pick && pick.active) {
      nextState = Cursor.State.VISIBLE
      const position = XY.trunc(
        Input.levelXY(pick, state.canvasWH, state.level.cam.bounds)
      )
      status |= Entity.moveTo(entity, position)
    } else if (point && point.active) {
      nextState = Cursor.State.VISIBLE
      const position = XY.trunc(
        Input.levelXY(point, state.canvasWH, state.level.cam.bounds)
      )
      status |= Entity.moveTo(entity, position)
    }
    status |= Entity.setState(entity, nextState)

    return status
  }
}
