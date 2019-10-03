import {Text} from '../text/Text'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {UpdateState} from '../../updaters/UpdateState'
import {Level} from '../../../levels/Level'
import {Input} from '../../../inputs/Input'

export class Checkbox extends Text {
  checked: boolean

  constructor({checked, ...props}: Checkbox.Props) {
    super(props)
    this.checked = checked || false
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)
    const collision = Level.collisionWithCursor(state.level, this)

    const toggle = collision && Input.inactiveTriggered(state.inputs.pick)
    const nextChecked = toggle ? !this.checked : this.checked
    if (this.checked !== nextChecked) status |= UpdateStatus.TERMINATE
    this.checked = nextChecked

    return (
      status |
      this.setState(
        this.checked ? CheckboxState.CHECKED : CheckboxState.UNCHECKED
      )
    )
  }
}

export namespace Checkbox {
  export interface Props extends Text.Props {
    readonly checked?: boolean
  }
}
export enum CheckboxState {
  UNCHECKED = 'unchecked',
  CHECKED = 'checked'
}
