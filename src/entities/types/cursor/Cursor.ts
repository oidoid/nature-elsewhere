import {Entity} from '../../../entity/Entity'
import {Input} from '../../../inputs/Input'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {UpdateState} from '../../updaters/UpdateState'

export class Cursor extends Entity {
  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)
    let nextState: CursorState | Entity.State = Entity.State.HIDDEN
    const {point, pick} = state.inputs
    if (pick && pick.active) {
      // it would be good to throttle this so precise picking is easier
      nextState = CursorState.VISIBLE
      const position = Input.levelXY(
        pick,
        state.canvasWH,
        state.level.cam.bounds
      )
      status |= this.moveTo(position)
    } else if (point && point.active) {
      nextState = CursorState.VISIBLE
      const position = Input.levelXY(
        point,
        state.canvasWH,
        state.level.cam.bounds
      )
      status |= this.moveTo(position)
    }
    status |= this.setState(nextState)

    return status
  }
}
export enum CursorState {
  VISIBLE = 'visible'
}
