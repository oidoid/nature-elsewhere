import {LevelEditorPanel} from './level-editor-panel'
import {EntityPicker} from '../entity-picker/entity-picker'
import {UpdaterParser} from '../../updaters/updater-parser'
import {EntityType} from '../../entity-type/entity-type'
import {Entity} from '../../entity/entity'
import {EntityID} from '../../entity-id/entity-id'
import {Checkbox} from '../checkbox/checkbox'
import {Atlas} from '../../../atlas/atlas/atlas'
import {NumberUtil} from '../../../math/number/number-util'
import {EntityState} from '../../entity-state/entity-state'
import {EntityTypeUtil} from '../../entity-type/entity-type-util'
import {EntityUtil} from '../../entity/entity-util'
import {CheckboxParser} from '../checkbox/checkbox-parser'
import {EntityPickerParser} from '../entity-picker/entity-picker-parser'
import {defaultTypeState} from '../../type-config-map'
import {IEntityParser} from '../../recursive-entity-parser'

export namespace LevelEditorPanelParser {
  export const parse: UpdaterParser = (panel, atlas, parser) => {
    if (
      !EntityTypeUtil.assert<LevelEditorPanel>(
        panel,
        EntityType.UI_LEVEL_EDITOR_PANEL
      )
    )
      throw new Error()
    const radioGroup = EntityUtil.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_RADIO_GROUP
    )
    const xCheckbox = EntityUtil.find(panel, EntityID.UI_LEVEL_EDITOR_PANEL_X)
    const yCheckbox = EntityUtil.find(panel, EntityID.UI_LEVEL_EDITOR_PANEL_Y)
    const stateCheckbox = EntityUtil.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_STATE
    )
    const entityCheckbox = EntityUtil.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_ENTITY
    )
    const entityPicker = EntityUtil.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_ENTITY_PICKER
    )
    const decrementButton = EntityUtil.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_DECREMENT
    )
    const incrementButton = EntityUtil.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_INCREMENT
    )
    const removeButton = EntityUtil.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_REMOVE
    )
    const addButton = EntityUtil.find(panel, EntityID.UI_LEVEL_EDITOR_PANEL_ADD)
    const toggleGridButton = EntityUtil.find(
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
      atlas,
      parser
    )

    return ret
  }

  export function updatePickerAndStuf(
    panel: LevelEditorPanel,
    radioGroup: Entity,
    checkbox: Checkbox,
    picker: EntityPicker,
    offset: number,
    atlas: Atlas,
    parser: IEntityParser
  ): void {
    EntityPickerParser.setActiveChild(picker, picker.activeChildIndex + offset)
    const child = EntityPickerParser.getActiveChild(picker)
    if (!child) return
    const text = child.type
    CheckboxParser.setText(
      checkbox,
      text.replace(/^(scenery|char)/, ''),
      atlas,
      parser
    )
    panel.stateIndex = defaultStateIndex(picker)
    updatePickerAndStufForState(
      panel,
      radioGroup,
      panel.stateCheckbox,
      picker,
      0,
      atlas,
      parser
    )
  }

  export function updatePickerAndStufForState(
    panel: LevelEditorPanel,
    radioGroup: Entity,
    checkbox: Checkbox,
    picker: EntityPicker,
    offset: number,
    atlas: Atlas,
    parser: IEntityParser
  ): void {
    const child = EntityPickerParser.getActiveChild(picker)
    if (!child) return
    panel.stateIndex = NumberUtil.wrap(
      panel.stateIndex + offset,
      0,
      Object.keys(child.imageStates).filter(
        state => state !== EntityState.HIDDEN
      ).length
    )
    const state = Object.keys(child.imageStates).filter(
      state => state !== EntityState.HIDDEN
    )[panel.stateIndex]
    EntityUtil.setState(child, state)
    CheckboxParser.setText(checkbox, state, atlas, parser)
    EntityUtil.invalidateBounds(radioGroup)
  }
}

function defaultStateIndex(picker: EntityPicker): number {
  const child = EntityPickerParser.getActiveChild(picker)
  if (!child) return 0
  const defaultState = defaultTypeState(child.type)
  if (!defaultState) return 0
  return Object.keys(child.imageStates)
    .filter(state => state !== EntityState.HIDDEN)
    .indexOf(defaultState)
}
