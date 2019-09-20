import {EntityType} from '../../entity-type/entity-type'
import {UpdateStatus} from '../../updaters/update-status/update-status'
import {Input} from '../../../inputs/input'
import {Level} from '../../../levels/level/level'
import {Update} from '../../updaters/update'
import {Button} from './button'
import {EntityTypeUtil} from '../../entity-type/entity-type-util'
import {EntityUtil} from '../../entity/entity-util'
import {ButtonState} from './button-state'

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
