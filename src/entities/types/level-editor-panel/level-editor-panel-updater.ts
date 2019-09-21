import {EntityID} from '../../entity-id/entity-id'
import {EntityState} from '../../entity-state/entity-state'
import {EntityType} from '../../entity-type/entity-type'
import {PlaneState} from '../plane/plane-state'
import {UpdateStatus} from '../../updaters/update-status/update-status'
import {Update} from '../../updaters/update'
import {LevelEditorPanel} from './level-editor-panel'
import {EntityTypeUtil} from '../../entity-type/entity-type-util'
import {EntityUtil} from '../../entity/entity-util'
import {EntityParser} from '../../entity/entity-parser'
import {LevelEditorPanelUtil} from './level-editor-panel-util'
import {UpdateState} from '../../updaters/update-state'
import {CheckboxParser} from '../checkbox/checkbox-parser'
import {Checkbox} from '../checkbox/checkbox'
import {EntityPickerParser} from '../entity-picker/entity-picker-parser'

export namespace LevelEditorPanelUpdater {
  export const update: Update = (panel, state) => {
    if (
      !EntityTypeUtil.assert<LevelEditorPanel>(
        panel,
        EntityType.UI_LEVEL_EDITOR_PANEL
      )
    )
      throw new Error()

    let status = UpdateStatus.UNCHANGED
    if (panel.decrementButton.clicked || panel.incrementButton.clicked) {
      const offset = panel.decrementButton.clicked
        ? -1
        : panel.incrementButton.clicked
        ? 1
        : 0
      if (panel.xCheckbox.checked)
        updateNumberCheckbox(panel.xCheckbox, state, offset)
      else if (panel.yCheckbox.checked)
        updateNumberCheckbox(panel.yCheckbox, state, offset)
      else if (panel.entityCheckbox.checked) updateEntity(panel, state, offset)
      else if (panel.stateCheckbox.checked)
        updateEntityState(panel, state, offset)
    }
    if (panel.removeButton.clicked) {
    }
    if (panel.addButton.clicked) {
      const child = EntityPickerParser.getActiveChild(panel.entityPicker)
      if (child) {
        const position = {
          x: checkboxNumber(panel.xCheckbox),
          y: checkboxNumber(panel.yCheckbox)
        }
        const entity = EntityParser.parse(
          {
            type: child.type,
            state: child.state,
            position
          },
          state.level.atlas
        )
        state.level.parentEntities.push(entity)
      }
    }
    if (panel.toggleGridButton.clicked) toggleGrid(state)

    return status | UpdateStatus.UPDATED
  }
}

function updateNumberCheckbox(
  checkbox: Checkbox,
  state: UpdateState,
  offset: number
): void {
  const num = checkboxNumber(checkbox) + offset
  CheckboxParser.setText(
    checkbox,
    num.toString(),
    state.level.atlas,
    EntityParser.parse
  )
}

function checkboxNumber(checkbox: Checkbox) {
  const text = checkbox.text
  return Number.parseInt(text)
}

function updateEntity(
  panel: LevelEditorPanel,
  state: UpdateState,
  offset: number
): void {
  LevelEditorPanelUtil.setEntityFields(
    panel,
    offset,
    state.level.atlas,
    EntityParser.parse
  )
}

function updateEntityState(
  panel: LevelEditorPanel,
  state: UpdateState,
  offset: number
): void {
  LevelEditorPanelUtil.setEntityStateFields(
    panel,
    offset,
    state.level.atlas,
    EntityParser.parse
  )
}

function toggleGrid(state: UpdateState): void {
  const grid = EntityUtil.findAny(state.level.parentEntities, EntityID.UI_GRID)
  if (!grid) throw new Error('Missing grid.')
  const toggle =
    grid.state === EntityState.HIDDEN ? PlaneState.GRID : EntityState.HIDDEN
  EntityUtil.setState(grid, toggle)
}
