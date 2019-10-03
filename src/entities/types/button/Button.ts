import {Entity} from '../../../entity/Entity'
import {Input} from '../../../inputs/Input'
import {Level} from '../../../levels/Level'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {UpdateState} from '../../updaters/UpdateState'

export class Button extends Entity {
  clicked: boolean
  longClicked: boolean
  constructor(props: Entity.Props) {
    super(props)
    this.clicked = false
    this.longClicked = false
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)

    this.clicked = false
    const collision = Level.collisionWithCursor(state.level, this)
    if (!collision) return this.setState(ButtonState.UNCLICKED)

    status |= this.setState(ButtonState.CLICKED) // this is just presentation not click state

    const nextClicked = Input.inactiveTriggered(state.inputs.pick)
    const nextLongClicked = Input.activeLong(state.inputs.pick)
    if (this.clicked !== nextClicked) status |= UpdateStatus.TERMINATE
    if (this.longClicked !== nextLongClicked) status |= UpdateStatus.TERMINATE
    this.clicked = nextClicked
    this.longClicked = nextLongClicked

    return status
  }
}

export enum ButtonState {
  UNCLICKED = 'unclicked',
  CLICKED = 'clicked'
}
