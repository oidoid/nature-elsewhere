import {Entity} from '../../../entity/Entity'
import {EntityType} from '../../../entity/EntityType'
import {Input} from '../../../inputs/Input'
import {Level} from '../../../levels/Level'
import {Update} from '../../updaters/Update'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'

export interface Button extends Entity {
  readonly type: EntityType.UI_BUTTON
  clicked: boolean
  longClicked: boolean
}

export namespace Button {
  export enum State {
    UNCLICKED = 'unclicked',
    CLICKED = 'clicked'
  }

  export const update: Update = (button, state) => {
    if (!button.assert<Button>(EntityType.UI_BUTTON)) throw new Error()

    button.clicked = false
    const collision = Level.collisionWithCursor(state.level, button)
    if (!collision) return button.setState(Button.State.UNCLICKED)

    let status = button.setState(Button.State.CLICKED) // this is just presentation not click state

    const nextClicked = Input.inactiveTriggered(state.inputs.pick)
    const nextLongClicked = Input.activeLong(state.inputs.pick)
    if (button.clicked !== nextClicked) status |= UpdateStatus.TERMINATE
    if (button.longClicked !== nextLongClicked) status |= UpdateStatus.TERMINATE
    button.clicked = nextClicked
    button.longClicked = nextLongClicked

    return status
  }
}
