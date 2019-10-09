import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../../atlas/AtlasID'
import {Button} from '../Button'
import {Checkbox} from '../Checkbox'
import {CollisionPredicate} from '../../collision/CollisionPredicate'
import {CollisionType} from '../../collision/CollisionType'
import {EntityFactory} from '../../entity/EntityFactory'
import {Entity} from '../../entity/Entity'
import {EntityID} from '../../entity/EntityID'
import {EntityParser} from '../../entity/EntityParser'
import {EntityPicker} from '../EntityPicker'
import {EntityType} from '../../entity/EntityType'
import {
  FollowCam,
  FollowCamOrientation
} from '../../updaters/followCam/FollowCam'
import {Group} from '../group/Group'
import {Image} from '../../image/Image'
import {ImageRect} from '../../imageStateMachine/ImageRect'
import {JSONValue} from '../../utils/JSON'
import {Layer} from '../../image/Layer'
import {LevelEditorPanelBackground} from './LevelEditorPanelBackground'
import {Level} from '../../levels/Level'
import {LevelType} from '../../levels/LevelType'
import {LocalStorage} from '../../storage/LocalStorage'
import {Marquee} from '../Marquee'
import {ObjectUtil} from '../../utils/ObjectUtil'
import {Plane} from '../Plane'
import {RadioCheckboxGroup} from '../RadioCheckboxGroup'
import {Text} from '../text/Text'
import {UpdatePredicate} from '../../updaters/updatePredicate/UpdatePredicate'
import {UpdateState} from '../../updaters/UpdateState'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {WH} from '../../math/WH'
import {XY} from '../../math/XY'
import {FollowCamUpdater} from '../../updaters/followCam/FollowCamUpdater'

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

    this._followCam = ObjectUtil.freeze({
      positionRelativeToCam: FollowCamOrientation.SOUTH_EAST,
      camMargin: new WH(0, 0)
    })
    this._variantCheckbox = new Checkbox(atlas, {
      textMaxSize: new WH(31, 5),
      position: new XY(13, 12),
      imageID: AtlasID.PALETTE_BLACK
    })
    this._stateCheckbox = new Checkbox(atlas, {
      textMaxSize: new WH(34, 5),
      position: new XY(10, 18),
      imageID: AtlasID.PALETTE_BLACK
    })
    this._xCheckbox = new Checkbox(atlas, {
      text: '0',
      textLayer: Layer.UI_HI,
      position: new XY(4, 24),
      imageID: AtlasID.PALETTE_BLACK
    })
    this._yCheckbox = new Checkbox(atlas, {
      text: '0',
      textLayer: Layer.UI_HI,
      position: new XY(26, 24),
      imageID: AtlasID.PALETTE_BLACK
    })
    this._entityCheckbox = new Checkbox(atlas, {
      state: Checkbox.State.CHECKED,
      textMaxSize: new WH(32, 5),
      position: new XY(46, 0),
      imageID: AtlasID.PALETTE_BLACK
    })
    this._radioGroup = new RadioCheckboxGroup({
      position: new XY(50, 2),
      children: [
        new Text(atlas, {
          text: 'var',
          textLayer: Layer.UI_HI,
          position: new XY(2, 12)
        }),
        this._variantCheckbox,
        new Text(atlas, {
          text: 'st',
          textLayer: Layer.UI_HI,
          position: new XY(2, 18)
        }),
        this._stateCheckbox,
        new Text(atlas, {
          text: 'x',
          textLayer: Layer.UI_HI,
          position: new XY(0, 24)
        }),
        this._xCheckbox,
        new Text(atlas, {
          text: 'y',
          textLayer: Layer.UI_HI,
          position: new XY(22, 24)
        }),
        this._yCheckbox,
        this._entityCheckbox
      ]
    })
    this._menuButton = new Button(atlas, {
      position: new XY(2, 22),
      children: [
        new Group({
          map: {
            [Entity.BaseState.HIDDEN]: new ImageRect(),
            [Group.State.VISIBLE]: new ImageRect({
              images: [
                new Image(atlas, {
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
      position: new XY(10, 22),
      children: [
        new Group({
          map: {
            [Entity.BaseState.HIDDEN]: new ImageRect(),
            [Group.State.VISIBLE]: new ImageRect({
              images: [
                new Image(atlas, {
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
      position: new XY(18, 22),
      children: [
        new Group({
          map: {
            [Entity.BaseState.HIDDEN]: new ImageRect(),
            [Group.State.VISIBLE]: new ImageRect({
              images: [
                new Image(atlas, {
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
      position: new XY(26, 22),
      children: [
        new Group({
          map: {
            [Entity.BaseState.HIDDEN]: new ImageRect(),
            [Group.State.VISIBLE]: new ImageRect({
              images: [
                new Image(atlas, {
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
      position: new XY(34, 22),
      children: [
        new Group({
          map: {
            [Entity.BaseState.HIDDEN]: new ImageRect(),
            [Group.State.VISIBLE]: new ImageRect({
              images: [
                new Image(atlas, {
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
      position: new XY(42, 22),
      children: [
        new Group({
          map: {
            [Entity.BaseState.HIDDEN]: new ImageRect(),
            [Group.State.VISIBLE]: new ImageRect({
              images: [
                new Image(atlas, {
                  id: AtlasID.UI_BUTTON_TOGGLE_GRID,
                  layer: Layer.UI_HIHI
                })
              ]
            })
          }
        })
      ]
    })
    this._entityPicker = new EntityPicker(atlas, {position: new XY(97, 0)})
    this.addChildren(
      this._menuButton,
      this._decrementButton,
      this._incrementButton,
      this._destroyButton,
      this._createButton,
      this._toggleGridButton,
      this._entityPicker,
      this._radioGroup,
      new LevelEditorPanelBackground(atlas)
    )

    this.setEntityFields(0, atlas)

    this._load = true

    // the panel background needs to be higher so raise everything.
    this.elevate(Layer.UI_PICKER_OFFSET)
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)

    status |= FollowCamUpdater.update(this._followCam, this, state)

    if (this._load) {
      this._load = false
      const data = LocalStorage.get(
        LocalStorage.Key.LEVEL_EDITOR_SANDBOX_AUTO_SAVE
      )
      if (data !== undefined) {
        const config = JSON.parse(data)
        let sandboxChildren: Maybe<Entity[]>
        try {
          sandboxChildren = EntityParser.parseAll(config, state.level.atlas)
        } catch (e) {
          console.error(e, data, config)
        }
        if (sandboxChildren) {
          const sandbox = Entity.findAnyByID(
            state.level.parentEntities,
            EntityID.UI_LEVEL_EDITOR_SANDBOX
          )
          if (!sandbox) throw new Error('Missing sandbox.')
          sandbox.addChildren(...sandboxChildren)
        }
      }
    }

    if (this._menuButton.clicked) {
      Level.advance(state.level, LevelType.UI_LEVEL_EDITOR_MENU)
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
        this._updateNumberCheckbox(this._xCheckbox, state, offset)
      else if (this._yCheckbox.checked())
        this._updateNumberCheckbox(this._yCheckbox, state, offset)
      else if (this._entityCheckbox.checked()) this.updateEntity(state, offset)
      else if (this._stateCheckbox.checked())
        this.updateEntityState(state, offset)
      else if (this._variantCheckbox.checked())
        this.updateEntityVariant(state, offset)
    }

    if (this._createButton.clicked) {
      status |= UpdateStatus.UPDATED
      const child = this._entityPicker.getActiveChild()
      if (child) {
        const position = new XY(
          checkboxNumber(this._xCheckbox),
          checkboxNumber(this._yCheckbox)
        )
        let entity = EntityFactory.produce(state.level.atlas, {
            type: child.type,
            state: child.state(),
            variant: child.variant,
            position
          })
          // force collision to bounds for picking
        ;(<any>entity).collisionPredicate = CollisionPredicate.BOUNDS
        const sandbox = Entity.findAnyByID(
          state.level.parentEntities,
          EntityID.UI_LEVEL_EDITOR_SANDBOX
        )
        if (!sandbox) throw new Error('Missing sandbox.')

        // marquee.setSelection(entity)
        sandbox.addChildren(entity)
        // [todo] set selection here
      }
    }
    if (this._toggleGridButton.clicked) toggleGrid(state)

    const marquee = <Maybe<Marquee>>(
      Entity.findAnyByID(state.level.parentEntities, EntityID.UI_MARQUEE)
    )
    if (
      marquee &&
      marquee.selection &&
      marquee.state() !== Entity.BaseState.HIDDEN
    ) {
      const {selection} = marquee
      const sandbox = Entity.findAnyByID(
        state.level.parentEntities,
        EntityID.UI_LEVEL_EDITOR_SANDBOX
      )
      if (!sandbox) throw new Error('Missing sandbox.')
      if (this._destroyButton.clicked) {
        status |= UpdateStatus.UPDATED
        marquee.selection = undefined
        marquee.transition(Entity.BaseState.HIDDEN)
        sandbox.removeChild(selection)
      }
      if (
        this._decrementButton.clicked ||
        this._decrementButton.longClicked ||
        this._incrementButton.clicked ||
        this._incrementButton.longClicked
      ) {
        status |= UpdateStatus.UPDATED
        const position = new XY(
          checkboxNumber(this._xCheckbox),
          checkboxNumber(this._yCheckbox)
        )
        selection.moveTo(position)
        sandbox.invalidateBounds()
        marquee.moveTo(new XY(position.x - 1, position.y - 1))
      } else {
        const xOffset =
          selection.bounds.position.x - checkboxNumber(this._xCheckbox)
        this._updateNumberCheckbox(this._xCheckbox, state, xOffset)
        const yOffset =
          selection.bounds.position.y - checkboxNumber(this._yCheckbox)
        this._updateNumberCheckbox(this._yCheckbox, state, yOffset)
        if (xOffset || yOffset) status |= UpdateStatus.UPDATED
      }
    }

    if (status & UpdateStatus.UPDATED) {
      const sandbox = Entity.findAnyByID(
        state.level.parentEntities,
        EntityID.UI_LEVEL_EDITOR_SANDBOX
      )
      if (sandbox) {
        const data = JSON.stringify(sandbox.toJSON(), null, 2)
        LocalStorage.put(LocalStorage.Key.LEVEL_EDITOR_SANDBOX_AUTO_SAVE, data)
      }
    }

    return status
  }

  setEntityFields(offset: number, atlas: Atlas): void {
    this._entityPicker.setActiveChild(
      this._entityPicker.activeChildIndex + offset
    )
    const child = this._entityPicker.getActiveChild()
    if (!child) return
    const entityLabel = child.type
    this._entityCheckbox.setText(
      {textLayer: Layer.UI_PICKER_OFFSET, text: entityLabel},
      Layer.UI_PICKER_OFFSET,
      atlas
    )
    this.setEntityStateFields(0, atlas)
    this.setEntityVariantFields(0, atlas)
  }

  setEntityStateFields(offset: number, atlas: Atlas): void {
    this._entityPicker.offsetActiveChildStateIndex(offset)
    const child = this._entityPicker.getActiveChild()
    if (!child) return
    this._stateCheckbox.setText(
      {textLayer: Layer.UI_PICKER_OFFSET, text: child.state()},
      Layer.UI_PICKER_OFFSET,
      atlas
    )
    this._radioGroup.invalidateBounds()
  }

  setEntityVariantFields(offset: number, atlas: Atlas): void {
    this._entityPicker.offsetActiveChildVariantIndex(atlas, offset)
    const child = this._entityPicker.getActiveChild()
    if (!child) return
    this._variantCheckbox.setText(
      {textLayer: Layer.UI_PICKER_OFFSET, text: child.variant},
      Layer.UI_PICKER_OFFSET,
      atlas
    )
    this._radioGroup.invalidateBounds()
  }

  updateEntity(state: UpdateState, offset: number): void {
    this.setEntityFields(offset, state.level.atlas)
  }

  updateEntityState(state: UpdateState, offset: number): void {
    this.setEntityStateFields(offset, state.level.atlas)
  }

  updateEntityVariant(state: UpdateState, offset: number): void {
    this.setEntityVariantFields(offset, state.level.atlas)
  }

  toJSON(): JSONValue {
    return this._toJSON(defaults)
  }

  private _updateNumberCheckbox(
    checkbox: Checkbox,
    state: UpdateState,
    offset: number
  ): void {
    const num = checkboxNumber(checkbox) + offset
    checkbox.setText(
      {
        type: EntityType.UI_TEXT,
        textLayer: Layer.UI_PICKER_OFFSET,
        text: num.toString()
      },
      Layer.UI_PICKER_OFFSET,
      state.level.atlas
    )
    this._radioGroup.invalidateBounds()
  }
}

function checkboxNumber(checkbox: Checkbox) {
  const text = checkbox.getText()
  return Number.parseInt(text)
}

function toggleGrid(state: UpdateState): void {
  const grid = Entity.findAnyByID(state.level.parentEntities, EntityID.UI_GRID)
  if (!grid) throw new Error('Missing grid.')
  const toggle =
    grid.state() === Entity.BaseState.HIDDEN
      ? Plane.State.VISIBLE
      : Entity.BaseState.HIDDEN
  grid.transition(toggle)
}

export namespace LevelEditorPanel {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.UI_LEVEL_EDITOR_PANEL,
  variant: LevelEditorPanel.Variant.NONE,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionType: CollisionType.TYPE_UI,
  collisionPredicate: CollisionPredicate.CHILDREN,
  state: LevelEditorPanel.State.VISIBLE
})
