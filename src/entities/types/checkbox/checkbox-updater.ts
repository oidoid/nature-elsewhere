import {EntityType} from '../../entity-type/entity-type'
import {EntityUtil} from '../../entity/entity-util'
import {EntityTypeUtil} from '../../entity-type/entity-type-util'
import {Update} from '../../updaters/update'
import {UpdateStatus} from '../../updaters/update-status/update-status'
import {Input} from '../../../inputs/input'
import {Level} from '../../../levels/level/level'
import {Checkbox} from './checkbox'
import {CheckboxState} from './checkbox-state'

export namespace CheckboxUpdater {
  export const update: Update = (checkbox, state) => {
    if (!EntityTypeUtil.assert<Checkbox>(checkbox, EntityType.UI_CHECKBOX))
      throw new Error()
    const collision = Level.collisionWithCursor(state.level, checkbox)
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
