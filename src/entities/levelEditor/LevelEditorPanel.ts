import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../../atlas/AtlasID'
import {Button} from '../Button'
import {Checkbox} from '../Checkbox'
import {CollisionPredicate} from '../../collision/CollisionPredicate'
import {CollisionType} from '../../collision/CollisionType'
import {EntityFactory} from '../../entity/EntityFactory'
import {Entity} from '../../entity/Entity'
import {EntityID} from '../../entity/EntityID'
import {EntityPicker} from '../EntityPicker'
import {EntitySerializer} from '../../entity/EntitySerializer'
import {EntityType} from '../../entity/EntityType'
import {FollowCam} from '../../updaters/FollowCam'
import {Group} from '../group/Group'
import {Image} from '../../image/Image'
import {ImageRect} from '../../imageStateMachine/ImageRect'
import {JSONValue} from '../../utils/JSON'
import {Layer} from '../../image/Layer'
import {Level} from '../../levels/Level'
import {LevelEditorPanelBackground} from './LevelEditorPanelBackground'
import {LevelEditorSandboxFileUtil} from './LevelEditorSandboxFileUtil'
import {LevelType} from '../../levels/LevelType'
import {Marquee} from '../Marquee'
import * as memFont from '../../text/memFont.json'
import {Plane} from '../Plane'
import {RadioCheckboxGroup} from '../RadioCheckboxGroup'
import * as strings from '../../utils/strings.json'
import {Text} from '../text/Text'
import {UpdatePredicate} from '../../updaters/UpdatePredicate'
import {UpdateState} from '../../updaters/UpdateState'
import {UpdateStatus} from '../../updaters/UpdateStatus'
import {WH} from '../../math/WH'
import {XY} from '../../math/XY'

export class LevelEditorPanel extends Entity<
  LevelEditorPanel.Variant,
  LevelEditorPanel.State
> {
  private readonly _followCam: DeepImmutable<FollowCam>
  private readonly _radioGroup: Entity
  private readonly _xCheckbox: Checkbox
  private readonly _yCheckbox: Checkbox
  private readonly _variantCheckbox: Checkbox
  private readonly _stateCheckbox: Checkbox
  private readonly _entityCheckbox: Checkbox
  private readonly _entityPicker: EntityPicker
  private readonly _menuButton: Button
  private readonly _decrementButton: Button
  private readonly _incrementButton: Button
  private readonly _destroyButton: Button
  private readonly _createButton: Button
  private readonly _toggleGridButton: Button
  private _load: boolean

  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<LevelEditorPanel.Variant, LevelEditorPanel.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [LevelEditorPanel.State.VISIBLE]: new ImageRect()
      },
      ...props
    })

    this._followCam = Object.freeze({
      positionRelativeToCam: FollowCam.Orientation.SOUTH_EAST,
      camMargin: Object.freeze(new WH(0, 0))
    })
    this._variantCheckbox = new Checkbox({
      textMaxSize: new WH(31, 5),
      x: 13,
      y: 12,
      constituentID: AtlasID.PALETTE_BLACK
    })
    this._stateCheckbox = new Checkbox({
      textMaxSize: new WH(34, 5),
      x: 10,
      y: 18,
      constituentID: AtlasID.PALETTE_BLACK
    })
    this._xCheckbox = new Checkbox({
      text: '0',
      textLayer: Layer.UI_HI,
      x: 4,
      y: 24,
      constituentID: AtlasID.PALETTE_BLACK
    })
    this._yCheckbox = new Checkbox({
      text: '0',
      textLayer: Layer.UI_HI,
      x: 26,
      y: 24,
      constituentID: AtlasID.PALETTE_BLACK
    })
    this._entityCheckbox = new Checkbox({
      state: Checkbox.State.CHECKED,
      textMaxSize: new WH(32, 5),
      x: 46,
      constituentID: AtlasID.PALETTE_BLACK
    })
    this._radioGroup = new RadioCheckboxGroup({
      x: 55,
      y: 2,
      children: [
        new Text({
          text: strings['levelEditor/variant'],
          textLayer: Layer.UI_HI,
          x: 2,
          y: 12
        }),
        this._variantCheckbox,
        new Text({
          text: strings['levelEditor/state'],
          textLayer: Layer.UI_HI,
          x: 2,
          y: 18
        }),
        this._stateCheckbox,
        new Text({
          text: strings['levelEditor/x'],
          textLayer: Layer.UI_HI,
          y: 24
        }),
        this._xCheckbox,
        new Text({
          text: strings['levelEditor/y'],
          textLayer: Layer.UI_HI,
          x: 22,
          y: 24
        }),
        this._yCheckbox,
        this._entityCheckbox
      ]
    })
    this._menuButton = new Button(atlas, {
      x: 2,
      y: 22,
      children: [
        new Group({
          map: {
            [Entity.BaseState.HIDDEN]: new ImageRect(),
            [Group.State.VISIBLE]: new ImageRect({
              images: [
                Image.new(atlas, {
                  id: AtlasID.UI_BUTTON_MENU,
                  layer: Layer.UI_HIHI
                })
              ]
            })
          }
        })
      ]
    })
    this._decrementButton = new Button(atlas, {
      x: 11,
      y: 22,
      children: [
        new Group({
          map: {
            [Entity.BaseState.HIDDEN]: new ImageRect(),
            [Group.State.VISIBLE]: new ImageRect({
              images: [
                Image.new(atlas, {
                  id: AtlasID.UI_BUTTON_DECREMENT,
                  layer: Layer.UI_HIHI
                })
              ]
            })
          }
        })
      ]
    })
    this._incrementButton = new Button(atlas, {
      x: 20,
      y: 22,
      children: [
        new Group({
          map: {
            [Entity.BaseState.HIDDEN]: new ImageRect(),
            [Group.State.VISIBLE]: new ImageRect({
              images: [
                Image.new(atlas, {
                  id: AtlasID.UI_BUTTON_INCREMENT,
                  layer: Layer.UI_HIHI
                })
              ]
            })
          }
        })
      ]
    })
    this._destroyButton = new Button(atlas, {
      x: 29,
      y: 22,
      children: [
        new Group({
          map: {
            [Entity.BaseState.HIDDEN]: new ImageRect(),
            [Group.State.VISIBLE]: new ImageRect({
              images: [
                Image.new(atlas, {
                  id: AtlasID.UI_BUTTON_DESTROY,
                  layer: Layer.UI_HIHI
                })
              ]
            })
          }
        })
      ]
    })
    this._createButton = new Button(atlas, {
      x: 38,
      y: 22,
      children: [
        new Group({
          map: {
            [Entity.BaseState.HIDDEN]: new ImageRect(),
            [Group.State.VISIBLE]: new ImageRect({
              images: [
                Image.new(atlas, {
                  id: AtlasID.UI_BUTTON_CREATE,
                  layer: Layer.UI_HIHI
                })
              ]
            })
          }
        })
      ]
    })
    this._toggleGridButton = new Button(atlas, {
      x: 47,
      y: 22,
      children: [
        new Group({
          map: {
            [Entity.BaseState.HIDDEN]: new ImageRect(),
            [Group.State.VISIBLE]: new ImageRect({
              images: [
                Image.new(atlas, {
                  id: AtlasID.UI_BUTTON_TOGGLE_GRID,
                  layer: Layer.UI_HIHI
                })
              ]
            })
          }
        })
      ]
    })
    this._entityPicker = new EntityPicker(atlas, {
      position: new XY(101, 1 + memFont.lineHeight)
    })
    this.addChildren(
      this._menuButton,
      this._decrementButton,
      this._incrementButton,
      this._destroyButton,
      this._createButton,
      this._toggleGridButton,
      this._entityPicker,
      this._radioGroup,
      new LevelEditorPanelBackground()
    )

    this._offsetEntityCheckboxIndex(atlas, 0)

    this._load = true

    // the panel background needs to be higher so raise everything.
    this.elevate(Layer.UI_PICKER_OFFSET)
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)

    status |= FollowCam.update(this._followCam, this, state)

    if (this._load) {
      this._load = false
      const {sandbox} = state.level
      if (sandbox)
        LevelEditorSandboxFileUtil.loadAutoSave(state.level.atlas, sandbox)
    }

    if (this._menuButton.clicked) {
      Level.advance(state.level, LevelType.LEVEL_EDITOR_MENU)
      status |= UpdateStatus.UPDATED | UpdateStatus.TERMINATE
    }

    if (
      this._decrementButton.clicked ||
      this._decrementButton.longClicked ||
      this._incrementButton.clicked ||
      this._incrementButton.longClicked
    ) {
      status |= UpdateStatus.UPDATED
      const offset =
        this._decrementButton.clicked || this._decrementButton.longClicked
          ? -1
          : this._incrementButton.clicked || this._incrementButton.longClicked
          ? 1
          : 0
      if (this._xCheckbox.checked())
        this._offsetRadioCheckbox(this._xCheckbox, offset)
      else if (this._yCheckbox.checked())
        this._offsetRadioCheckbox(this._yCheckbox, offset)
      else if (this._entityCheckbox.checked())
        this._offsetEntityCheckboxIndex(state.level.atlas, offset)
      else if (this._stateCheckbox.checked()) this._offsetStateCheckbox(offset)
      else if (this._variantCheckbox.checked())
        this._offsetVariantCheckbox(state.level.atlas, offset)
    }

    if (this._createButton.clicked) {
      status |= UpdateStatus.UPDATED
      const child = this._entityPicker.getActiveChild()
      if (child) {
        const position = new XY(
          parseIntCheckbox(this._xCheckbox),
          parseIntCheckbox(this._yCheckbox)
        )
        let entity = EntityFactory.produce(state.level.atlas, {
          type: child.type,
          state: child.state(),
          variant: child.variant,
          position
        })
        const {sandbox} = state.level
        if (sandbox) sandbox.addChildren(entity)
        const marquee = <Maybe<Marquee>>(
          Entity.findAnyByID(state.level.parentEntities, EntityID.UI_MARQUEE)
        )
        if (marquee) marquee.setSelection(entity, state.level.cursor)
      }
    }
    if (this._toggleGridButton.clicked) toggleGrid(state)

    const marquee = <Maybe<Marquee>>(
      Entity.findAnyByID(state.level.parentEntities, EntityID.UI_MARQUEE)
    )
    if (
      marquee &&
      marquee.selection &&
      marquee.state() === Marquee.State.VISIBLE
    ) {
      const {selection} = marquee
      const {sandbox} = state.level
      if (this._destroyButton.clicked) {
        status |= UpdateStatus.UPDATED
        marquee.setSelection(undefined, state.level.cursor)
        if (sandbox) sandbox.removeChild(selection)
      }

      if (
        this._decrementButton.clicked ||
        this._decrementButton.longClicked ||
        this._incrementButton.clicked ||
        this._incrementButton.longClicked
      ) {
        status |= UpdateStatus.UPDATED
        const position = new XY(
          parseIntCheckbox(this._xCheckbox),
          parseIntCheckbox(this._yCheckbox)
        )
        selection.moveTo(position)
        if (sandbox) sandbox.invalidateBounds()
        marquee.moveTo(new XY(position.x - 1, position.y - 1))
      } else {
        const {atlas} = state.level
        const xOffset =
          selection.bounds.position.x - parseIntCheckbox(this._xCheckbox)
        this._offsetRadioCheckbox(this._xCheckbox, xOffset)
        const yOffset =
          selection.bounds.position.y - parseIntCheckbox(this._yCheckbox)
        this._offsetRadioCheckbox(this._yCheckbox, yOffset)
        if (marquee.selectionTriggered) {
          const index = this._pickerIndexOf(selection)
          if (index !== undefined) this._setEntityCheckboxIndex(atlas, index)
          this._setVariantCheckbox(atlas, selection.variant)
          this._setStateCheckbox(selection.state())
        }
        status |= UpdateStatus.UPDATED
      }
    }

    if (status & UpdateStatus.UPDATED) {
      const {sandbox} = state.level
      if (sandbox) LevelEditorSandboxFileUtil.autoSave(sandbox)
    }

    return status
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }

  private _pickerIndexOf(entity: Entity): Maybe<number> {
    for (let i = 0; i < this._entityPicker.children.length; ++i)
      if (this._entityPicker.children[i].type === entity.type) return i
    return
  }

  private _offsetEntityCheckboxIndex(atlas: Atlas, offset: number): void {
    const index = this._entityPicker.activeChildIndex + offset
    this._setEntityCheckboxIndex(atlas, index)
  }

  private _setEntityCheckboxIndex(atlas: Atlas, index: number): void {
    this._entityPicker.setActiveChild(index)
    const child = this._entityPicker.getActiveChild()
    if (!child) return
    this._setRadioCheckboxText(this._entityCheckbox, child.type)
    this._offsetStateCheckbox(0)
    this._offsetVariantCheckbox(atlas, 0)
  }

  private _offsetStateCheckbox(offset: number): void {
    this._entityPicker.offsetActiveChildStateIndex(offset)
    const child = this._entityPicker.getActiveChild()
    if (child) this._setRadioCheckboxText(this._stateCheckbox, child.state())
  }

  private _setStateCheckbox(state: string): void {
    const child = this._entityPicker.getActiveChild()
    if (child) child.transition(state)
    this._setRadioCheckboxText(this._stateCheckbox, state)
  }

  private _offsetVariantCheckbox(atlas: Atlas, offset: number): void {
    this._entityPicker.offsetActiveChildVariantIndex(atlas, offset)
    const child = this._entityPicker.getActiveChild()
    if (child) this._setRadioCheckboxText(this._variantCheckbox, child.variant)
  }

  private _setVariantCheckbox(atlas: Atlas, variant: string): void {
    this._entityPicker.setActiveChildVariant(atlas, variant)
    const child = this._entityPicker.getActiveChild()
    if (child) this._setRadioCheckboxText(this._variantCheckbox, child.variant)
  }

  private _offsetRadioCheckbox(checkbox: Checkbox, offset: number): void {
    const int = parseIntCheckbox(checkbox) + offset
    this._setRadioCheckboxText(checkbox, int.toString())
  }

  private _setRadioCheckboxText(checkbox: Checkbox, text: string): void {
    checkbox.setText(text, Layer.UI_PICKER_OFFSET)
    this._radioGroup.invalidateBounds()
  }
}

export namespace LevelEditorPanel {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

function parseIntCheckbox(checkbox: Checkbox): number {
  return Number.parseInt(checkbox.getText())
}

function toggleGrid(state: UpdateState): void {
  const grid = Entity.findAnyByID(state.level.planes, EntityID.UI_GRID)
  const toggle =
    grid?.state() === Entity.BaseState.HIDDEN
      ? Plane.State.VISIBLE
      : Entity.BaseState.HIDDEN
  grid?.transition(toggle)
}

const defaults = Object.freeze({
  type: EntityType.UI_LEVEL_EDITOR_PANEL,
  variant: LevelEditorPanel.Variant.NONE,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionType: CollisionType.TYPE_UI,
  collisionPredicate: CollisionPredicate.CHILDREN,
  state: LevelEditorPanel.State.VISIBLE
})
