import {EntityType} from '../../entityType/EntityType'

import {Update} from '../../updaters/Update'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {Input} from '../../../inputs/Input'
import {Checkbox} from './Checkbox'
import {CheckboxState} from './CheckboxState'

import {Entity} from '../../entity/Entity'
import {Level} from '../../../levels/level/Level'

export namespace CheckboxUpdater {
  export const update: Update = (checkbox, state) => {
    if (!Entity.assert<Checkbox>(checkbox, EntityType.UI_CHECKBOX))
      throw new Error()
    const collision = Level.collisionWithCursor(state.level, checkbox)

    let status = UpdateStatus.UNCHANGED
    const toggle = collision && Input.inactiveTriggered(state.inputs.pick)
    const nextChecked = toggle ? !checkbox.checked : checkbox.checked
    if (checkbox.checked !== nextChecked) status |= UpdateStatus.TERMINATE
    checkbox.checked = nextChecked

    return (
      status |
      Entity.setState(
        checkbox,
        checkbox.checked ? CheckboxState.CHECKED : CheckboxState.UNCHECKED
      )
    )
  }
}
