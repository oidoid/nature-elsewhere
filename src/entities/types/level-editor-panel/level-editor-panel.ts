import {Button} from '../button/button'
import {Checkbox} from '../checkbox/checkbox'
import {Entity} from '../../entity/entity'
import {EntityID} from '../../entity-id/entity-id'
import {EntityState} from '../../entity-state/entity-state'
import {EntityType} from '../../entity-type/entity-type'
import {PLANE} from '../plane/plane'
import {Updater} from '../../updaters/updater/updater'
import {UpdateStatus} from '../../updaters/update-status/update-status'
import {EntityPicker} from '../entity-picker/entity-picker'
import {Atlas} from '../../../atlas/atlas/atlas'
import {EntityTypeConfigMap} from '../../entity-type-config-map/entity-type-config-map'
import {NumberUtil} from '../../../math/number/number-util'

export interface LevelEditorPanel extends Entity {
  readonly type: EntityType.UI_LEVEL_EDITOR_PANEL
  readonly radioGroup: Entity
  readonly xCheckbox: Checkbox
  readonly yCheckbox: Checkbox
  readonly stateCheckbox: Checkbox
  stateIndex: number
  readonly entityCheckbox: Checkbox
  readonly entityPicker: EntityPicker
  readonly decrementButton: Button
  readonly incrementButton: Button
  readonly removeButton: Button
  readonly addButton: Button
  readonly toggleGridButton: Button
}

export namespace LevelEditorPanel {
  export const parse: Updater.Parse = (panel, atlas) => {
    if (
      !EntityType.assert<LevelEditorPanel>(
        panel,
        EntityType.UI_LEVEL_EDITOR_PANEL
      )
    )
      throw new Error()
    const radioGroup = Entity.find(panel, EntityID.UI_LEVEL_EDITOR_RADIO_GROUP)
    const xCheckbox = Entity.find(panel, EntityID.UI_LEVEL_EDITOR_PANEL_X)
    const yCheckbox = Entity.find(panel, EntityID.UI_LEVEL_EDITOR_PANEL_Y)
    const stateCheckbox = Entity.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_STATE
    )
    const entityCheckbox = Entity.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_ENTITY
    )
    const entityPicker = Entity.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_ENTITY_PICKER
    )
    const decrementButton = Entity.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_DECREMENT
    )
    const incrementButton = Entity.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_INCREMENT
    )
    const removeButton = Entity.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_REMOVE
    )
    const addButton = Entity.find(panel, EntityID.UI_LEVEL_EDITOR_PANEL_ADD)
    const toggleGridButton = Entity.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_TOGGLE_GRID
    )
    const ret = {
      ...panel,
      radioGroup,
      xCheckbox,
      yCheckbox,
      stateCheckbox,
      entityCheckbox,
      entityPicker,
      decrementButton,
      incrementButton,
      removeButton,
      addButton,
      toggleGridButton
    }
    updatePickerAndStuf(
      <LevelEditorPanel>ret,
      <Entity>radioGroup,
      <Checkbox>entityCheckbox,
      <EntityPicker>entityPicker,
      0,
      atlas
    )

    return ret
  }

  export const update: Updater.Update = (panel, state) => {
    if (
      !EntityType.assert<LevelEditorPanel>(
        panel,
        EntityType.UI_LEVEL_EDITOR_PANEL
      )
    )
      throw new Error()

    let status = UpdateStatus.UNCHANGED
    for (const ui of [
      panel.xCheckbox,
      panel.yCheckbox,
      panel.stateCheckbox,
      panel.entityCheckbox,
      panel.entityPicker,
      panel.decrementButton,
      panel.incrementButton,
      panel.removeButton,
      panel.addButton,
      panel.toggleGridButton
    ]) {
      status |= Entity.update(ui, state)
      if (UpdateStatus.terminate(status)) break
    }

    if (panel.addButton.clicked) {
    }
    if (panel.decrementButton.clicked) {
      if (panel.xCheckbox.checked) {
      } else if (panel.yCheckbox.checked) {
      } else if (panel.entityCheckbox.checked)
        updatePickerAndStuf(
          panel,
          panel.radioGroup,
          panel.entityCheckbox,
          panel.entityPicker,
          -1,
          state.level.atlas
        )
      else if (panel.stateCheckbox.checked)
        updatePickerAndStufForState(
          panel,
          panel.radioGroup,
          panel.stateCheckbox,
          panel.entityPicker,
          -1,
          state.level.atlas
        )
    }
    if (panel.incrementButton.clicked) {
      if (panel.xCheckbox.checked) {
        console.log('increment')
      } else if (panel.yCheckbox.checked) {
      } else if (panel.entityCheckbox.checked)
        updatePickerAndStuf(
          panel,
          panel.radioGroup,
          panel.entityCheckbox,
          panel.entityPicker,
          1,
          state.level.atlas
        )
      else if (panel.stateCheckbox.checked)
        updatePickerAndStufForState(
          panel,
          panel.radioGroup,
          panel.stateCheckbox,
          panel.entityPicker,
          1,
          state.level.atlas
        )
    }
    if (panel.toggleGridButton.clicked) {
      let grid
      for (const entity of state.level.parentEntities) {
        grid = Entity.find(entity, EntityID.UI_GRID)
        if (grid) break
      }
      if (!grid) throw new Error('Missing grid.')
      const toggle =
        grid.state === EntityState.HIDDEN
          ? PLANE.State.GRID
          : EntityState.HIDDEN
      Entity.setState(grid, toggle)
    }

    return status
  }
}
function updatePickerAndStuf(
  panel: LevelEditorPanel,
  radioGroup: Entity,
  checkbox: Checkbox,
  picker: EntityPicker,
  offset: number,
  atlas: Atlas
): void {
  EntityPicker.setVisibleChild(picker, picker.activeChildIndex + offset)
  const text = EntityPicker.getVisibleChild(picker).type
  Checkbox.setText(checkbox, text.replace(/^(scenery|char)/, ''), atlas)
  panel.stateIndex = defaultStateIndex(picker)
  updatePickerAndStufForState(
    panel,
    radioGroup,
    panel.stateCheckbox,
    picker,
    0,
    atlas
  )
}

function updatePickerAndStufForState(
  panel: LevelEditorPanel,
  radioGroup: Entity,
  checkbox: Checkbox,
  picker: EntityPicker,
  offset: number,
  atlas: Atlas
): void {
  const child = EntityPicker.getVisibleChild(picker)
  panel.stateIndex = NumberUtil.wrap(
    panel.stateIndex + offset,
    0,
    Object.keys(child.imageStates).filter(state => state !== EntityState.HIDDEN)
      .length
  )
  const state = Object.keys(child.imageStates).filter(
    state => state !== EntityState.HIDDEN
  )[panel.stateIndex]
  Entity.setState(child, state)
  Checkbox.setText(checkbox, state, atlas)
  Entity.invalidateBounds(radioGroup)
}

function defaultStateIndex(picker: EntityPicker) {
  const child = EntityPicker.getVisibleChild(picker)
  const defaultState = EntityTypeConfigMap[child.type].state
  if (!defaultState) return 0
  return Object.keys(child.imageStates)
    .filter(state => state !== EntityState.HIDDEN)
    .indexOf(defaultState)
}
