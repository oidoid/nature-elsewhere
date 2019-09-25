import {LevelEditorPanel} from './LevelEditorPanel'
import {UpdaterParser} from '../../updaters/UpdaterParser'
import {EntityType} from '../../entityType/EntityType'
import {EntityID} from '../../entityID/EntityID'
import {EntityTypeUtil} from '../../entityType/EntityTypeUtil'
import {EntityUtil} from '../../entity/EntityUtil'
import {LevelEditorPanelUtil} from './LevelEditorPanelUtil'
import {Layer} from '../../../images/layer/Layer'

export namespace LevelEditorPanelParser {
  export const parse: UpdaterParser = (panel, atlas, parser) => {
    if (
      !EntityTypeUtil.assert<LevelEditorPanel>(
        panel,
        EntityType.UI_LEVEL_EDITOR_PANEL
      )
    )
      throw new Error()
    const radioGroup = EntityUtil.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_RADIO_GROUP
    )
    const xCheckbox = EntityUtil.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_X
    )
    const yCheckbox = EntityUtil.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_Y
    )
    const stateCheckbox = EntityUtil.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_STATE
    )
    const entityCheckbox = EntityUtil.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_ENTITY
    )
    const entityPicker = EntityUtil.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_ENTITY_PICKER
    )
    const decrementButton = EntityUtil.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_DECREMENT
    )
    const incrementButton = EntityUtil.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_INCREMENT
    )
    const destroyButton = EntityUtil.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_REMOVE
    )
    const createButton = EntityUtil.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_ADD
    )
    const toggleGridButton = EntityUtil.findByID(
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
      destroyButton,
      createButton,
      toggleGridButton
    }
    LevelEditorPanelUtil.setEntityFields(
      <LevelEditorPanel>ret,
      0,
      atlas,
      parser
    )
    EntityUtil.elevate(ret, Layer.UI_PICKER_OFFSET)

    return ret
  }
}
