import {EntityID} from '../../entity-id/entity-id'
import {EntityState} from '../../entity-state/entity-state'
import {EntityType} from '../../entity-type/entity-type'
import {PLANE} from '../plane/plane'
import {UpdateStatus} from '../../updaters/update-status/update-status'
import {Update} from '../../updaters/update'
import {LevelEditorPanelParser} from './level-editor-panel-parser'
import {LevelEditorPanel} from './level-editor-panel'
import {EntityTypeUtil} from '../../entity-type/entity-type-util'
import {EntityUtil} from '../../entity/entity-util'

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
      status |= EntityUtil.update(ui, state)
      if (UpdateStatus.terminate(status)) break
    }

    if (panel.addButton.clicked) {
    }
    if (panel.decrementButton.clicked) {
      if (panel.xCheckbox.checked) {
      } else if (panel.yCheckbox.checked) {
      } else if (panel.entityCheckbox.checked)
        LevelEditorPanelParser.updatePickerAndStuf(
          panel,
          panel.radioGroup,
          panel.entityCheckbox,
          panel.entityPicker,
          -1,
          state.level.atlas
        )
      else if (panel.stateCheckbox.checked)
        LevelEditorPanelParser.updatePickerAndStufForState(
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
        LevelEditorPanelParser.updatePickerAndStuf(
          panel,
          panel.radioGroup,
          panel.entityCheckbox,
          panel.entityPicker,
          1,
          state.level.atlas
        )
      else if (panel.stateCheckbox.checked)
        LevelEditorPanelParser.updatePickerAndStufForState(
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
        grid = EntityUtil.find(entity, EntityID.UI_GRID)
        if (grid) break
      }
      if (!grid) throw new Error('Missing grid.')
      const toggle =
        grid.state === EntityState.HIDDEN
          ? PLANE.State.GRID
          : EntityState.HIDDEN
      EntityUtil.setState(grid, toggle)
    }

    return status
  }
}
