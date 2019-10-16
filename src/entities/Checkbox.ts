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
import {Limits} from '../math/Limits'
import {ObjectUtil} from '../utils/ObjectUtil'
import {Text} from './text/Text'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

export class Checkbox extends Entity<Checkbox.Variant, Checkbox.State> {
  private _textLayer: Layer
  private _textScale: XY
  private _textMaxSize: WH
  private _textImageID: Maybe<AtlasID>
  constructor(atlas: Atlas, props?: Checkbox.Props) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Checkbox.State.UNCHECKED]: new ImageRect(),
        [Checkbox.State.CHECKED]: new ImageRect()
      },
      ...props
    })

    this._textLayer = (props && props.textLayer) || defaults.textLayer
    this._textScale = (props && props.textScale) || defaults.textScale.copy()
    this._textMaxSize =
      (props && props.textMaxSize) || defaults.textMaxSize.copy()
    this._textImageID = (props && props.imageID) || defaults.textImageID
    this.setText((props && props.text) || '', 0, atlas)
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)
    const collision = Level.collisionWithCursor(state.level, this)

    const toggle = collision && Input.inactiveTriggered(state.inputs.pick)
    const nextChecked = toggle ? !this.checked() : this.checked()
    if (toggle) status |= UpdateStatus.TERMINATE

    return (
      status |
      this.transition(
        nextChecked ? Checkbox.State.CHECKED : Checkbox.State.UNCHECKED
      )
    )
  }

  setText(text: string, layerOffset: number, atlas: Atlas): void {
    const position = new XY(this.bounds.position.x + 1, this.bounds.position.y)
    const child = new Text(atlas, {
      textLayer: this._textLayer,
      textScale: this._textScale,
      textMaxSize: this._textMaxSize,
      imageID: this._textImageID,
      text,
      position
    })
    child.elevate(layerOffset)
    const imageID = this.children[0] ? this.children[0].imageID() : undefined
    if (imageID) child.setImageID(imageID)
    this.removeChild(this.children[0])
    this.addChildren(child)
    this.setBackground(layerOffset, atlas)
  }

  checked(): boolean {
    return this.state() === Checkbox.State.CHECKED
  }

  getText(): string {
    return (<Text>this.children[0]).text
  }

  toJSON(): JSONValue {
    const diff = EntitySerializer.serialize(this, defaults)
    if (this._textLayer !== defaults.textLayer) diff.textLayer = this._textLayer
    if (!this._textScale.equal(defaults.textScale))
      diff.textScale = {x: this._textScale.x, y: this._textScale.y}
    if (!this._textMaxSize.equal(defaults.textMaxSize))
      diff.textMaxSize = {w: this._textMaxSize.w, h: this._textMaxSize.h}
    if (this._textImageID !== defaults.textImageID)
      diff.textImageID = this._textImageID
    return diff
  }

  private setBackground(layerOffset: number, atlas: Atlas): void {
    const text = this.children[0]
    for (const state of [Checkbox.State.UNCHECKED, Checkbox.State.CHECKED]) {
      const size = new WH(text.bounds.size.w, text.bounds.size.h)
      const images = newBackgroundImages(state, layerOffset, atlas, size)
      this.replaceImages(state, ...images)
    }
    this.moveImagesTo(
      new XY(text.bounds.position.x - 1, this.bounds.position.y)
    )
  }
}

export namespace Checkbox {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    UNCHECKED = 'unchecked',
    CHECKED = 'checked'
  }

  export interface Props extends Text.Props<Checkbox.Variant, State> {}
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
    size: new WH(w + 2, Math.max(h - 2, 2)),
    layer
  })
  return [backgroundImage, borderImage]
}

const defaults = ObjectUtil.freeze({
  type: EntityType.UI_CHECKBOX,
  variant: Checkbox.Variant.NONE,
  state: Checkbox.State.UNCHECKED,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionType: CollisionType.TYPE_UI,
  collisionPredicate: CollisionPredicate.BOUNDS,
  textLayer: Layer.UI_HI,
  textScale: new XY(1, 1),
  textMaxSize: new WH(Limits.maxShort, Limits.maxShort),
  textImageID: undefined
})
