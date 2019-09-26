import {EntityType} from '../../entityType/EntityType'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {Input} from '../../../inputs/Input'
import {Update} from '../../updaters/Update'
import {Button} from './Button'
import {Entity} from '../../entity/Entity'
import {Level} from '../../../levels/level/Level'

export namespace ButtonUpdater {
  export const update: Update = (button, state) => {
    if (!Entity.assert<Button>(button, EntityType.UI_BUTTON)) throw new Error()

    button.clicked = false
    const collision = Level.collisionWithCursor(state.level, button)
    if (!collision) return Entity.setState(button, Button.State.UNCLICKED)

    let status = Entity.setState(button, Button.State.CLICKED) // this is just presentation not click state

    const nextClicked = Input.inactiveTriggered(state.inputs.pick)
    const nextLongClicked = Input.activeLong(state.inputs.pick)
    if (button.clicked !== nextClicked) status |= UpdateStatus.TERMINATE
    if (button.longClicked !== nextLongClicked) status |= UpdateStatus.TERMINATE
    button.clicked = nextClicked
    button.longClicked = nextLongClicked

    return status
  }
}
