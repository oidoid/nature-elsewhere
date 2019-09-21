import {EntityType} from '../../entityType/EntityType'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {Input} from '../../../inputs/Input'
import {Level} from '../../../levels/level/Level'
import {Update} from '../../updaters/Update'
import {Button} from './Button'
import {EntityTypeUtil} from '../../entityType/EntityTypeUtil'
import {EntityUtil} from '../../entity/EntityUtil'
import {ButtonState} from './ButtonState'

export namespace ButtonUpdater {
  export const update: Update = (button, state) => {
    if (!EntityTypeUtil.assert<Button>(button, EntityType.UI_BUTTON))
      throw new Error()

    button.clicked = false
    const collision = Level.collisionWithCursor(state.level, button)
    if (!collision) return EntityUtil.setState(button, ButtonState.UNCLICKED)

    let status = EntityUtil.setState(button, ButtonState.CLICKED) // this is just presentation not click state

    const nextClicked = Input.activeTriggered(state.inputs.pick)
    if (button.clicked !== nextClicked) status |= UpdateStatus.TERMINATE
    button.clicked = nextClicked

    return status
  }
}
