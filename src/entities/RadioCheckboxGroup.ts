import {Checkbox} from './Checkbox'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'

export class RadioCheckboxGroup extends Entity<
  RadioCheckboxGroup.Variant,
  RadioCheckboxGroup.State
> {
  private _checked?: Checkbox
  constructor(
    props?: Entity.SubProps<
      RadioCheckboxGroup.Variant,
      RadioCheckboxGroup.State
    >
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [RadioCheckboxGroup.State.VISIBLE]: new ImageRect()
      },
      ...props
    })
    for (const child of this.children) {
      if (child instanceof Checkbox && child.checked()) {
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
      if (
        child instanceof Checkbox &&
        child !== this._checked &&
        child.checked()
      )
        checked = child
      if (UpdateStatus.terminate(status)) return status
    }

    if (checked) {
      if (this._checked) this._checked.transition(Checkbox.State.UNCHECKED)
      this._checked = checked
    }

    return status
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace RadioCheckboxGroup {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.UI_RADIO_CHECKBOX_GROUP,
  variant: RadioCheckboxGroup.Variant.NONE,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionPredicate: CollisionPredicate.CHILDREN,
  collisionType: CollisionType.TYPE_UI,
  state: RadioCheckboxGroup.State.VISIBLE
})
