import {Entity} from '../../../entity/Entity'
import {EntityType} from '../../../entity/EntityType'
import {Input} from '../../../inputs/Input'
import {Update} from '../../updaters/Update'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'

export interface Cursor extends Entity {
  readonly type: EntityType.UI_CURSOR
}

export namespace Cursor {
  export enum State {
    VISIBLE = 'visible'
  }

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
