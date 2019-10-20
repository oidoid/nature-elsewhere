import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Input} from '../inputs/Input'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../image/Layer'
import {Level} from '../levels/Level'
import {UpdatePredicate} from '../updaters/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/UpdateStatus'

export class Button extends Entity<Button.Variant, Button.State> {
  private _clicked: boolean
  private _longClicked: boolean
  private _engaged: boolean
  constructor(atlas: Atlas, props?: Button.Props) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Button.State.UNCLICKED]: new ImageRect({
          images: [
            Image.withAtlasSize(atlas, {
              id: AtlasID.UI_BUTTON_BASE,
              layer: Layer.UI_MID
            })
          ]
        }),
        [Button.State.CLICKED]: new ImageRect({
          images: [
            Image.withAtlasSize(atlas, {
              id: AtlasID.UI_BUTTON_BASE,
              layer: Layer.UI_MID
            }),
            Image.withAtlasSize(atlas, {
              id: AtlasID.UI_BUTTON_PRESSED,
              layer: Layer.UI_HI
            })
          ]
        })
      },
      ...props
    })
    this._clicked = props?.clicked ?? false
    this._longClicked = props?.longClicked ?? false
    this._engaged = false
  }

  get clicked(): boolean {
    return this._clicked
  }

  get longClicked(): boolean {
    return this._longClicked
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)

    this._clicked = false
    const collision = Level.collisionWithCursor(state.level, this)
    this._engaged =
      !!(collision && !state.inputs.pick?.active) ||
      !!(this._engaged && collision && state.inputs.pick?.active)
    status |= this.transition(
      this._engaged ? Button.State.CLICKED : Button.State.UNCLICKED
    ) // this is just presentation not click state

    const nextClicked =
      this._engaged && Input.inactiveTriggered(state.inputs.pick)
    const nextLongClicked = this._engaged && Input.activeLong(state.inputs.pick)
    if (this._clicked !== nextClicked) status |= UpdateStatus.TERMINATE
    if (this._longClicked !== nextLongClicked) status |= UpdateStatus.TERMINATE
    this._clicked = nextClicked
    this._longClicked = nextLongClicked

    return status
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Button {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    UNCLICKED = 'unclicked',
    CLICKED = 'clicked'
  }

  export interface Props extends Entity.SubProps<Button.Variant, Button.State> {
    clicked?: boolean
    longClicked?: boolean
  }
}

const defaults = Object.freeze({
  type: EntityType.UI_BUTTON,
  variant: Button.Variant.NONE,
  state: Button.State.UNCLICKED,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionType: CollisionType.TYPE_UI,
  collisionPredicate: CollisionPredicate.BOUNDS
})
