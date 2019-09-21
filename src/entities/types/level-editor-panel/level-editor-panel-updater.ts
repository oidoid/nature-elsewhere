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
        LevelEditorPanelUtil.setEntityFields(
          panel,
          -1,
          state.level.atlas,
          EntityParser.parse
        )
      else if (panel.stateCheckbox.checked)
        LevelEditorPanelUtil.setStateFields(
          panel,
          -1,
          state.level.atlas,
          EntityParser.parse
        )
    }
    if (panel.incrementButton.clicked) {
      if (panel.xCheckbox.checked) {
        console.log('increment')
      } else if (panel.yCheckbox.checked) {
      } else if (panel.entityCheckbox.checked)
        LevelEditorPanelUtil.setEntityFields(
          panel,
          1,
          state.level.atlas,
          EntityParser.parse
        )
      else if (panel.stateCheckbox.checked)
        LevelEditorPanelUtil.setStateFields(
          panel,
          1,
          state.level.atlas,
          EntityParser.parse
        )
    }
    if (panel.toggleGridButton.clicked) {
      const grid = EntityUtil.findAny(
        state.level.parentEntities,
        EntityID.UI_GRID
      )
      if (!grid) throw new Error('Missing grid.')
      const toggle =
        grid.state === EntityState.HIDDEN ? PlaneState.GRID : EntityState.HIDDEN
      EntityUtil.setState(grid, toggle)
    }

    return status
  }
}
