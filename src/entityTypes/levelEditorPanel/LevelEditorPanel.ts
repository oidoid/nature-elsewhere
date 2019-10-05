import {Atlas} from 'aseprite-atlas'
import {Button} from '../Button'
import {Checkbox} from '../checkbox/Checkbox'
import {CollisionPredicate} from '../../collision/CollisionPredicate'
import {Entity} from '../../entity/Entity'
import {EntityID} from '../../entity/EntityID'
import {EntityParser} from '../../entity/EntityParser'
import {EntityPicker} from '../entityPicker/EntityPicker'
import {
  EntityType,
  SCENERY_VALUE_PREFIX,
  CHAR_VALUE_PREFIX
} from '../../entity/EntityType'
import {Layer} from '../../image/Layer'
import {Marquee} from '../Marquee'
import {UpdateState} from '../../entities/updaters/UpdateState'
import {UpdateStatus} from '../../entities/updaters/updateStatus/UpdateStatus'
import {XY} from '../../math/XY'
import {UpdatePredicate} from '../../entities/updaters/updatePredicate/UpdatePredicate'
import {CollisionType} from '../../collision/CollisionType'
import {WH} from '../../math/WH'
import {AtlasID} from '../../atlas/AtlasID'
import {LevelEditorPanelBackground} from './LevelEditorPanelBackground'
import {PlaneState} from '../Plane'

export class LevelEditorPanel extends Entity {
  readonly radioGroup: Entity
  readonly xCheckbox: Checkbox
  readonly yCheckbox: Checkbox
  readonly stateCheckbox: Checkbox
  readonly entityCheckbox: Checkbox
  readonly entityPicker: EntityPicker
  readonly decrementButton: Button
  readonly incrementButton: Button
  readonly destroyButton: Button
  readonly createButton: Button
  readonly toggleGridButton: Button

  constructor(
    atlas: Atlas,
    {
      type = EntityType.UI_LEVEL_EDITOR_PANEL,
      updatePredicate = UpdatePredicate.ALWAYS,
      collisionType = CollisionType.TYPE_UI,
      collisionPredicate = CollisionPredicate.CHILDREN,
      radioGroup,
      xCheckbox,
      yCheckbox,
      stateCheckbox,
      entityCheckbox = new Checkbox(atlas, {
        type: EntityType.UI_CHECKBOX,
        textMaxSize: new WH(32, 5),
        position: new XY(88, 2),
        imageID: AtlasID.PALETTE_BLACK
      }),
      entityPicker,
      decrementButton,
      incrementButton,
      destroyButton,
      createButton,
      toggleGridButton,
      ...props
    }: LevelEditorPanel.Props
  ) {
    super({...props, type, updatePredicate, collisionType, collisionPredicate})

    this.radioGroup = <Entity>(
      this.findByID(EntityID.UI_LEVEL_EDITOR_RADIO_GROUP)
    )
    this.xCheckbox = <Checkbox>this.findByID(EntityID.UI_LEVEL_EDITOR_PANEL_X)
    this.yCheckbox = <Checkbox>this.findByID(EntityID.UI_LEVEL_EDITOR_PANEL_Y)
    this.stateCheckbox = <Checkbox>(
      this.findByID(EntityID.UI_LEVEL_EDITOR_PANEL_STATE)
    )
    this.entityCheckbox = entityCheckbox
    this.children.push(
      this.entityCheckbox,
      new LevelEditorPanelBackground(atlas)
    )
    this.invalidateBounds()
    this.entityPicker = <EntityPicker>(
      this.findByID(EntityID.UI_LEVEL_EDITOR_PANEL_ENTITY_PICKER)
    )
    this.decrementButton = <Button>(
      this.findByID(EntityID.UI_LEVEL_EDITOR_PANEL_DECREMENT)
    )
    this.incrementButton = <Button>(
      this.findByID(EntityID.UI_LEVEL_EDITOR_PANEL_INCREMENT)
    )
    this.destroyButton = <Button>(
      this.findByID(EntityID.UI_LEVEL_EDITOR_PANEL_REMOVE)
    )
    this.createButton = <Button>(
      this.findByID(EntityID.UI_LEVEL_EDITOR_PANEL_ADD)
    )
    this.toggleGridButton = <Button>(
      this.findByID(EntityID.UI_LEVEL_EDITOR_PANEL_TOGGLE_GRID)
    )

    this.setEntityFields(0, atlas)
    this.elevate(Layer.UI_PICKER_OFFSET)
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)
    if (
      this.decrementButton.clicked ||
      this.decrementButton.longClicked ||
      this.incrementButton.clicked ||
      this.incrementButton.longClicked
    ) {
      const offset =
        this.decrementButton.clicked || this.decrementButton.longClicked
          ? -1
          : this.incrementButton.clicked || this.incrementButton.longClicked
          ? 1
          : 0
      if (this.xCheckbox.checked)
        updateNumberCheckbox(this.xCheckbox, state, offset)
      else if (this.yCheckbox.checked)
        updateNumberCheckbox(this.yCheckbox, state, offset)
      else if (this.entityCheckbox.checked) this.updateEntity(state, offset)
      else if (this.stateCheckbox.checked) this.updateEntityState(state, offset)
    }

    if (this.createButton.clicked) {
      const child = this.entityPicker.getActiveChild()
      if (child) {
        const position = {
          x: checkboxNumber(this.xCheckbox),
          y: checkboxNumber(this.yCheckbox)
        }
        let entity = EntityParser.parse(
            {
              type: child.type,
              state: child.machine.state,
              position
            },
            state.level.atlas
          )
          // force collision to bounds for picking
        ;(<any>entity).collisionPredicate = CollisionPredicate.BOUNDS
        const sandbox = Entity.findAnyByID(
          state.level.parentEntities,
          EntityID.UI_LEVEL_EDITOR_SANDBOX
        )
        if (!sandbox) throw new Error('Missing sandbox.')

        sandbox.children.push(entity)
        sandbox.invalidateBounds()
        // [todo] set selection here
      }
    }
    if (this.toggleGridButton.clicked) toggleGrid(state)

    const marquee = <Maybe<Marquee>>(
      Entity.findAnyByID(state.level.parentEntities, EntityID.UI_MARQUEE)
    )
    if (
      marquee &&
      marquee.selection &&
      marquee.machine.state !== Entity.State.HIDDEN
    ) {
      const selection = Entity.findAnyBySpawnID(
        state.level.parentEntities,
        marquee.selection
      )
      if (!selection) throw new Error('Missing selection.')
      const sandbox = Entity.findAnyByID(
        state.level.parentEntities,
        EntityID.UI_LEVEL_EDITOR_SANDBOX
      )
      if (!sandbox) throw new Error('Missing sandbox.')
      if (this.destroyButton.clicked) {
        marquee.selection = undefined
        marquee.machine.setState(Entity.State.HIDDEN)
        const index = sandbox.children.findIndex(entity =>
          selection.equal(entity)
        )
        sandbox.children.splice(index, 1)
      }
      if (
        this.decrementButton.clicked ||
        this.decrementButton.longClicked ||
        this.incrementButton.clicked ||
        this.incrementButton.longClicked
      ) {
        const position = new XY(
          checkboxNumber(this.xCheckbox),
          checkboxNumber(this.yCheckbox)
        )
        selection.moveTo(position)
        sandbox.invalidateBounds()
        marquee.moveTo(new XY(position.x - 1, position.y - 1))
      } else {
        updateNumberCheckbox(
          this.xCheckbox,
          state,
          selection.bounds.position.x - checkboxNumber(this.xCheckbox)
        )
        updateNumberCheckbox(
          this.yCheckbox,
          state,
          selection.bounds.position.y - checkboxNumber(this.yCheckbox)
        )
      }
    }

    return status | UpdateStatus.UPDATED
  }

  setEntityFields(offset: number, atlas: Atlas): void {
    this.entityPicker.setActiveChild(
      this.entityPicker.activeChildIndex + offset
    )
    const child = this.entityPicker.getActiveChild()
    if (!child) return
    const entityLabel = child.type.replace(
      new RegExp(`^(${SCENERY_VALUE_PREFIX}|${CHAR_VALUE_PREFIX})`),
      ''
    )
    this.entityCheckbox.setText(
      {
        type: EntityType.UI_TEXT,
        textLayer: Layer.UI_PICKER_OFFSET,
        text: entityLabel
      },
      Layer.UI_PICKER_OFFSET,
      atlas
    )
    this.setEntityStateFields(0, atlas)
  }

  setEntityStateFields(offset: number, atlas: Atlas): void {
    const child = this.entityPicker.getActiveChild()
    if (!child) return
    this.entityPicker.offsetActiveChildStateIndex(offset)
    this.stateCheckbox.setText(
      {
        type: EntityType.UI_TEXT,
        textLayer: Layer.UI_PICKER_OFFSET,
        text: child.machine.state
      },
      Layer.UI_PICKER_OFFSET,
      atlas
    )
    this.radioGroup.invalidateBounds()
  }

  updateEntity(state: UpdateState, offset: number): void {
    this.setEntityFields(offset, state.level.atlas)
  }

  updateEntityState(state: UpdateState, offset: number): void {
    this.setEntityStateFields(offset, state.level.atlas)
  }
}

function updateNumberCheckbox(
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
}

function checkboxNumber(checkbox: Checkbox) {
  const text = checkbox.getText()
  return Number.parseInt(text)
}

function toggleGrid(state: UpdateState): void {
  const grid = Entity.findAnyByID(state.level.parentEntities, EntityID.UI_GRID)
  if (!grid) throw new Error('Missing grid.')
  const toggle =
    grid.machine.state === Entity.State.HIDDEN
      ? PlaneState.GRID
      : Entity.State.HIDDEN
  grid.setState(toggle)
}

export enum LevelEditorPanelState {
  VISIBLE = 'visible'
}

export namespace LevelEditorPanel {
  export interface Props extends Entity.Props {
    readonly type: EntityType.UI_LEVEL_EDITOR_PANEL
    readonly radioGroup: Entity
    readonly xCheckbox: Checkbox
    readonly yCheckbox: Checkbox
    readonly stateCheckbox: Checkbox
    readonly entityCheckbox: Checkbox
    readonly entityPicker: EntityPicker
    readonly decrementButton: Button
    readonly incrementButton: Button
    readonly destroyButton: Button
    readonly createButton: Button
    readonly toggleGridButton: Button
  }
}
