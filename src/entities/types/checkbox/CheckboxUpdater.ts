import {Checkbox, CheckboxState} from './Checkbox'
import {EntityType} from '../../../entity/EntityType'
import {Input} from '../../../inputs/Input'
import {Level} from '../../../levels/Level'
import {Update} from '../../updaters/Update'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'

export namespace CheckboxUpdater {
  export const update: Update = (checkbox, state) => {
    if (!checkbox.assert<Checkbox>(EntityType.UI_CHECKBOX)) throw new Error()
    const collision = Level.collisionWithCursor(state.level, checkbox)

    let status = UpdateStatus.UNCHANGED
    const toggle = collision && Input.inactiveTriggered(state.inputs.pick)
    const nextChecked = toggle ? !checkbox.checked : checkbox.checked
    if (checkbox.checked !== nextChecked) status |= UpdateStatus.TERMINATE
    checkbox.checked = nextChecked

    return (
      status |
      checkbox.setState(
        checkbox.checked ? CheckboxState.CHECKED : CheckboxState.UNCHECKED
      )
    )
  }
}
