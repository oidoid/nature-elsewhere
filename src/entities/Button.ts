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

export class Button extends Entity<Button.State> {
  clicked: boolean
  longClicked: boolean
  private _engaged: boolean
  constructor(atlas: Atlas, props?: Button.Props) {
    super({
      type: EntityType.UI_BUTTON,
      state: Button.State.UNCLICKED,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Button.State.UNCLICKED]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.UI_BUTTON_BASE,
              layer: Layer.UI_MID
            })
          ]
        }),
        [Button.State.CLICKED]: new ImageRect({
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
    this._engaged = false
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)

    this.clicked = false
    const collision = Level.collisionWithCursor(state.level, this)
    this._engaged =
      (collision && (!state.inputs.pick || !state.inputs.pick.active)) ||
      (this._engaged &&
        collision &&
        !!state.inputs.pick &&
        state.inputs.pick.active)
    status |= this.transition(
      this._engaged ? Button.State.CLICKED : Button.State.UNCLICKED
    ) // this is just presentation not click state

    const nextClicked =
      this._engaged && Input.inactiveTriggered(state.inputs.pick)
    const nextLongClicked = this._engaged && Input.activeLong(state.inputs.pick)
    if (this.clicked !== nextClicked) status |= UpdateStatus.TERMINATE
    if (this.longClicked !== nextLongClicked) status |= UpdateStatus.TERMINATE
    this.clicked = nextClicked
    this.longClicked = nextLongClicked

    return status
  }
}

export namespace Button {
  export enum State {
    UNCLICKED = 'unclicked',
    CLICKED = 'clicked'
  }

  export interface Props extends Entity.SubProps<Button.State> {
    clicked?: boolean
    longClicked?: boolean
  }
}
