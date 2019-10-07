import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Input} from '../inputs/Input'
import {Layer} from '../image/Layer'
import {Level} from '../levels/Level'
import {Text} from './text/Text'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

export class Checkbox extends Entity<Checkbox.State> {
  constructor(atlas: Atlas, props?: Checkbox.Props) {
    super({
      type: EntityType.UI_CHECKBOX,
      state: Checkbox.State.UNCHECKED,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Checkbox.State.UNCHECKED]: new ImageRect(),
        [Checkbox.State.CHECKED]: new ImageRect()
      },
      updatePredicate: UpdatePredicate.ALWAYS,
      collisionType: CollisionType.TYPE_UI,
      collisionPredicate: CollisionPredicate.BOUNDS,
      ...props
    })

    this.setText(
      {
        type: EntityType.UI_TEXT,
        text: props && props.text,
        textLayer: (props && props.textLayer) || Layer.UI_HI,
        textScale: props && props.textScale,
        textMaxSize: props && props.textMaxSize
      },
      0,
      atlas
    )
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)
    const collision = Level.collisionWithCursor(state.level, this)

    const toggle = collision && Input.inactiveTriggered(state.inputs.pick)
    const nextChecked = toggle ? !this.checked() : this.checked()
    if (this.checked() !== nextChecked) status |= UpdateStatus.TERMINATE

    return (
      status |
      this.setState(
        nextChecked ? Checkbox.State.CHECKED : Checkbox.State.UNCHECKED
      )
    )
  }

  setText(props: Text.Props, layerOffset: number, atlas: Atlas): void {
    const position = new XY(this.bounds.position.x + 1, this.bounds.position.y)
    const child = new Text(atlas, {...props, position})
    child.elevate(layerOffset)
    const imageID = this.children[0]
      ? this.children[0].imageRect().imageID
      : undefined
    if (imageID) child.setImageID(imageID)
    this.removeChild(this.children[0])
    this.addChildren(child)
    this.setBackground(layerOffset, atlas)
    this.invalidateBounds()
  }

  checked(): boolean {
    return this.getState() === Checkbox.State.CHECKED
  }

  getText(): string {
    return (<Text>this.children[0]).text
  }

  private setBackground(layerOffset: number, atlas: Atlas): void {
    const text = this.children[0]
    for (const state of [Checkbox.State.UNCHECKED, Checkbox.State.CHECKED]) {
      const size = new WH(text.bounds.size.w, text.bounds.size.h)
      const images = newBackgroundImages(state, layerOffset, atlas, size)
      this.machine.replaceImages(state, ...images)
    }
    this.machine.moveTo(
      new XY(text.bounds.position.x - 1, this.bounds.position.y)
    )
  }
}

export namespace Checkbox {
  export enum State {
    UNCHECKED = 'unchecked',
    CHECKED = 'checked'
  }

  export interface Props extends Text.Props<State> {}
}

const backgroundID: Readonly<Record<Checkbox.State, AtlasID>> = Object.freeze({
  [Checkbox.State.UNCHECKED]: AtlasID.PALETTE_PALE_GREEN,
  [Checkbox.State.CHECKED]: AtlasID.PALETTE_LIGHT_GREEN
})

function newBackgroundImages(
  state: Checkbox.State,
  layerOffset: number,
  atlas: Atlas,
  {w, h}: WH
): Image[] {
  const id = backgroundID[state]
  const layer = Layer.UI_MID + layerOffset
  const backgroundImage = new Image(atlas, {
    id,
    position: new XY(1, 0),
    size: new WH(w, h),
    layer
  })
  const borderImage = new Image(atlas, {
    id,
    position: new XY(0, 1),
    size: new WH(w + 2, h - 2),
    layer
  })
  return [backgroundImage, borderImage]
}
