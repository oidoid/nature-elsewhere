import {LevelEditorPanel} from './LevelEditorPanel'
import {UpdaterParser} from '../../updaters/UpdaterParser'
import {EntityType} from '../../../entity/EntityType'
import {EntityID} from '../../../entity/EntityID'
import {Layer} from '../../../image/Layer'

export namespace LevelEditorPanelParser {
  export const parse: UpdaterParser = (panel, atlas, parser) => {
    if (!panel.assert<LevelEditorPanel>(EntityType.UI_LEVEL_EDITOR_PANEL))
      throw new Error()
    const radioGroup = panel.findByID(EntityID.UI_LEVEL_EDITOR_RADIO_GROUP)
    const xCheckbox = panel.findByID(EntityID.UI_LEVEL_EDITOR_PANEL_X)
    const yCheckbox = panel.findByID(EntityID.UI_LEVEL_EDITOR_PANEL_Y)
    const stateCheckbox = panel.findByID(EntityID.UI_LEVEL_EDITOR_PANEL_STATE)
    const entityCheckbox = panel.findByID(EntityID.UI_LEVEL_EDITOR_PANEL_ENTITY)
    const entityPicker = panel.findByID(
      EntityID.UI_LEVEL_EDITOR_PANEL_ENTITY_PICKER
    )
    const decrementButton = panel.findByID(
      EntityID.UI_LEVEL_EDITOR_PANEL_DECREMENT
    )
    const incrementButton = panel.findByID(
      EntityID.UI_LEVEL_EDITOR_PANEL_INCREMENT
    )
    const destroyButton = panel.findByID(EntityID.UI_LEVEL_EDITOR_PANEL_REMOVE)
    const createButton = panel.findByID(EntityID.UI_LEVEL_EDITOR_PANEL_ADD)
    const toggleGridButton = panel.findByID(
      EntityID.UI_LEVEL_EDITOR_PANEL_TOGGLE_GRID
    )
    ;(<any>panel).radioGroup = radioGroup
    ;(<any>panel).xCheckbox = xCheckbox
    ;(<any>panel).yCheckbox = yCheckbox
    ;(<any>panel).stateCheckbox = stateCheckbox
    ;(<any>panel).entityCheckbox = entityCheckbox
    ;(<any>panel).entityPicker = entityPicker
    ;(<any>panel).decrementButton = decrementButton
    ;(<any>panel).incrementButton = incrementButton
    ;(<any>panel).destroyButton = destroyButton
    ;(<any>panel).createButton = createButton
    ;(<any>panel).toggleGridButton = toggleGridButton

    LevelEditorPanel.setEntityFields(<LevelEditorPanel>panel, 0, atlas, parser)
    panel.elevate(Layer.UI_PICKER_OFFSET)

    return panel
  }
}
