import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Input} from '../inputs/Input'
import {Layer} from '../sprite/Layer'
import {Level} from '../levels/Level'
import {Limits} from '../math/Limits'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {Text} from './text/Text'
import {UpdatePredicate} from '../updaters/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {WH} from '../math/WH'
import {XY} from '../math/XY'
import {TextPropsConfig} from './text/TextPropsConfig'

export class Checkbox extends Entity<Checkbox.Variant, Checkbox.State> {
  // [todo] can all this stuff be in Text? Lots of redundancy here.
  private _textLayer: Layer
  private _textScale: XY
  private _textMaxSize: WH
  private _textConstituentID: Maybe<AtlasID>
  constructor(props?: Checkbox.Props) {
    super({
      ...defaults,
      map: {
        [Checkbox.State.UNCHECKED]: new SpriteRect(),
        [Checkbox.State.CHECKED]: new SpriteRect()
      },
      ...props
    })

    this._textLayer = props?.textLayer ?? defaults.textLayer
    this._textScale = props?.textScale ?? defaults.textScale.copy()
    this._textMaxSize = props?.textMaxSize ?? defaults.textMaxSize.copy()
    this._textConstituentID = props?.constituentID ?? defaults.textConstituentID
    this.setText(props?.text ?? '', 0)
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

  setText(text: string, layerOffset: number): void {
    const position = new XY(this.origin.x + 1, this.origin.y)
    const child = new Text({
      textLayer: this._textLayer,
      textScale: this._textScale,
      textMaxSize: this._textMaxSize,
      constituentID: this._textConstituentID,
      text,
      position
    })
    child.elevateBy(layerOffset)
    const constituentID = this.children[0]?.constituentID
    if (constituentID) child.setConstituentID(constituentID)
    this.removeChild(this.children[0])
    this.addChildren(child)
    this.setBackground(layerOffset)
  }

  checked(): boolean {
    return this.state === Checkbox.State.CHECKED
  }

  getText(): string {
    return (<Maybe<Text>>this.children[0])?.text ?? ''
  }

  // [todo] would it be better to subclass Text? Seems very similar.
  toJSON(): TextPropsConfig {
    const diff: Writable<TextPropsConfig> = EntitySerializer.serialize(
      this,
      defaults
    )
    if (this._textLayer !== defaults.textLayer)
      diff.textLayer = Layer[this._textLayer]
    if (!this._textScale.equal(defaults.textScale))
      diff.textScale = {x: this._textScale.x, y: this._textScale.y}
    if (!this._textMaxSize.equal(defaults.textMaxSize))
      diff.textMaxSize = {w: this._textMaxSize.w, h: this._textMaxSize.h}
    // This will disappear if either 1) subclass Text 2) add textConstituentID
    // to Props.
    if (
      this._textConstituentID !== undefined &&
      this._textConstituentID !== defaults.textConstituentID
    )
      (<any>diff).textConstituentID = this._textConstituentID
    return diff
  }

  private setBackground(layerOffset: number): void {
    const text = this.children[0]
    for (const state of [Checkbox.State.UNCHECKED, Checkbox.State.CHECKED]) {
      const size = new WH(text.bounds.size.w, text.bounds.size.h)
      const sprites = newBackgroundSprites(state, layerOffset, size)
      this.replaceSprites(state, ...sprites)
    }
    this.moveSpritesTo(new XY(text.origin.x - 1, text.origin.y))
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

function newBackgroundSprites(
  state: Checkbox.State,
  layerOffset: number,
  {w, h}: WH
): Sprite[] {
  const id = backgroundID[state]
  const layer = Layer.UI_MID + layerOffset
  const backgroundSprite = new Sprite({id, position: new XY(1, 0), w, h, layer})
  const borderSprite = new Sprite({
    id,
    position: new XY(0, 1),
    w: w + 2,
    h: Math.max(h - 2, 2),
    layer
  })
  return [backgroundSprite, borderSprite]
}

const defaults = Object.freeze({
  type: EntityType.UI_CHECKBOX,
  variant: Checkbox.Variant.NONE,
  state: Checkbox.State.UNCHECKED,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionType: CollisionType.TYPE_UI,
  collisionPredicate: CollisionPredicate.BOUNDS,
  textLayer: Layer.UI_HI,
  textScale: Object.freeze(new XY(1, 1)),
  textMaxSize: Object.freeze(new WH(Limits.maxShort, Limits.maxShort)),
  textConstituentID: undefined
})
