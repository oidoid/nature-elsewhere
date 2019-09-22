import {EntityID} from '../../entityID/EntityID'
import {EntityState} from '../../entityState/EntityState'
import {EntityType} from '../../entityType/EntityType'
import {PlaneState} from '../plane/PlaneState'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {Update} from '../../updaters/Update'
import {LevelEditorPanel} from './LevelEditorPanel'
import {EntityTypeUtil} from '../../entityType/EntityTypeUtil'
import {EntityUtil} from '../../entity/EntityUtil'
import {EntityParser} from '../../entity/EntityParser'
import {LevelEditorPanelUtil} from './LevelEditorPanelUtil'
import {UpdateState} from '../../updaters/UpdateState'
import {CheckboxParser} from '../checkbox/CheckboxParser'
import {Checkbox} from '../checkbox/Checkbox'
import {EntityPickerParser} from '../entityPicker/EntityPickerParser'

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
            machine: {state: child.machine.state},
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
    grid.machine.state === EntityState.HIDDEN
      ? PlaneState.GRID
      : EntityState.HIDDEN
  EntityUtil.setState(grid, toggle)
}
