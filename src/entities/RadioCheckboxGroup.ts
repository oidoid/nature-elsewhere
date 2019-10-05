import {Checkbox, CheckboxState} from './Checkbox'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'

export class RadioCheckboxGroup extends Entity {
  private _checked?: Checkbox
  constructor(props?: Optional<Entity.Props, 'type'>) {
    super({
      type: EntityType.UI_RADIO_CHECKBOX_GROUP,
      updatePredicate: UpdatePredicate.ALWAYS,
      collisionPredicate: CollisionPredicate.CHILDREN,
      collisionType: CollisionType.TYPE_UI,
      ...props
    })
    for (const child of this.children) {
      if (child instanceof Checkbox && child.checked) {
        this._checked = child
        break
      }
    }
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state, true)

    let checked: Maybe<Checkbox> = undefined
    for (const child of this.children) {
      status |= child.update(state)
      if (child instanceof Checkbox && child !== this._checked && child.checked)
        checked = child
      if (UpdateStatus.terminate(status)) return status
    }

    if (checked) {
      if (this._checked) {
        this._checked.checked = false
        this._checked.setState(CheckboxState.UNCHECKED)
      }
      this._checked = checked
    }

    return status
  }
}
