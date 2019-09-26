import {LevelEditorPanel} from './LevelEditorPanel'
import {UpdaterParser} from '../../updaters/UpdaterParser'
import {EntityType} from '../../entity/EntityType'
import {EntityID} from '../../entity/EntityID'

import {Layer} from '../../../images/layer/Layer'
import {Entity} from '../../entity/Entity'

export namespace LevelEditorPanelParser {
  export const parse: UpdaterParser = (panel, atlas, parser) => {
    if (
      !Entity.assert<LevelEditorPanel>(panel, EntityType.UI_LEVEL_EDITOR_PANEL)
    )
      throw new Error()
    const radioGroup = Entity.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_RADIO_GROUP
    )
    const xCheckbox = Entity.findByID(panel, EntityID.UI_LEVEL_EDITOR_PANEL_X)
    const yCheckbox = Entity.findByID(panel, EntityID.UI_LEVEL_EDITOR_PANEL_Y)
    const stateCheckbox = Entity.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_STATE
    )
    const entityCheckbox = Entity.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_ENTITY
    )
    const entityPicker = Entity.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_ENTITY_PICKER
    )
    const decrementButton = Entity.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_DECREMENT
    )
    const incrementButton = Entity.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_INCREMENT
    )
    const destroyButton = Entity.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_REMOVE
    )
    const createButton = Entity.findByID(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_ADD
    )
    const toggleGridButton = Entity.findByID(
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
    LevelEditorPanel.setEntityFields(<LevelEditorPanel>ret, 0, atlas, parser)
    Entity.elevate(ret, Layer.UI_PICKER_OFFSET)

    return ret
  }
}
