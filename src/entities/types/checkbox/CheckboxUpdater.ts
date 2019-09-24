import {EntityType} from '../../entityType/EntityType'
import {EntityUtil} from '../../entity/EntityUtil'
import {EntityTypeUtil} from '../../entityType/EntityTypeUtil'
import {Update} from '../../updaters/Update'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {Input} from '../../../inputs/Input'
import {Checkbox} from './Checkbox'
import {CheckboxState} from './CheckboxState'
import {LevelUtil} from '../../../levels/level/LevelUtil'

export namespace CheckboxUpdater {
  export const update: Update = (checkbox, state) => {
    if (!EntityTypeUtil.assert<Checkbox>(checkbox, EntityType.UI_CHECKBOX))
      throw new Error()
    const collision = LevelUtil.collisionWithCursor(state.level, checkbox)
    if (!collision) return UpdateStatus.UNCHANGED

    let status = UpdateStatus.UNCHANGED
    const toggle = Input.activeTriggered(state.inputs.pick)
    const nextChecked = toggle ? !checkbox.checked : checkbox.checked
    if (checkbox.checked !== nextChecked) status |= UpdateStatus.TERMINATE
    checkbox.checked = nextChecked

    return (
      status |
      EntityUtil.setState(
        checkbox,
        checkbox.checked ? CheckboxState.CHECKED : CheckboxState.UNCHECKED
      )
    )
  }
}
