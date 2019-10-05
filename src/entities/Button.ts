import {Entity} from '../entity/Entity'
import {Input} from '../inputs/Input'
import {Level} from '../levels/Level'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {UpdateState} from '../updaters/UpdateState'
import {EntityType} from '../entity/EntityType'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {CollisionType} from '../collision/CollisionType'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Layer} from '../image/Layer'
import {Atlas} from 'aseprite-atlas'

export class Button extends Entity {
  clicked: boolean
  longClicked: boolean
  constructor(atlas: Atlas, props?: Button.Props) {
    super({
      type: EntityType.UI_BUTTON,
      state: ButtonState.UNCLICKED,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [ButtonState.UNCLICKED]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.UI_BUTTON_BASE,
              layer: Layer.UI_MID
            })
          ]
        }),
        [ButtonState.CLICKED]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.UI_BUTTON_BASE,
              layer: Layer.UI_MID
            }),
            new Image(atlas, {
              id: AtlasID.UI_BUTTON_PRESSED,
              layer: Layer.UI_HI
            })
          ]
        })
      },
      updatePredicate: UpdatePredicate.ALWAYS,
      collisionType: CollisionType.TYPE_UI,
      collisionPredicate: CollisionPredicate.BOUNDS,
      ...props
    })
    this.clicked = (props && props.clicked) || false
    this.longClicked = (props && props.longClicked) || false
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

export namespace Button {
  export interface Props extends Optional<Entity.Props, 'type'> {
    clicked?: boolean
    longClicked?: boolean
  }
}
