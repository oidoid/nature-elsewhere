import {Checkbox} from './Checkbox'
import {EntityType} from '../../../entity/EntityType'
import {Input} from '../../../inputs/Input'
import {Level} from '../../../levels/Level'
import {Text} from '../text/Text'
import {Update} from '../../updaters/Update'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'

export interface Checkbox extends Omit<Text, 'type'> {
  readonly type: EntityType.UI_CHECKBOX
  checked: boolean
}
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
        checkbox.checked ? Checkbox.State.CHECKED : Checkbox.State.UNCHECKED
      )
    )
  }
}
