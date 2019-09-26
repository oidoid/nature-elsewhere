/** Identifier, not necessarily unique, specified at creation time as needed to
    distinguish among instances of the same type. For example, two entities may
    both be of type "bee" but have "happy" and "angry" IDs. */
export enum EntityID {
  ANONYMOUS = 'anonymous',
  UI_GRID = 'uiGrid',
  UI_MARQUEE = 'uiMarquee',
  UI_PLAYER = 'uiPlayer',
  UI_LINK_START = 'uiLinkStart',
  UI_LINK_OPTIONS = 'uiLinkOptions',
  UI_LINK_LEVEL_EDITOR = 'uiLinkLevelEditor',
  UI_LINK_EXIT = 'uiLinkExit',
  UI_LEVEL_EDITOR_PANEL = 'uiLevelEditorPanel',
  UI_LEVEL_EDITOR_RADIO_GROUP = 'uiLevelEditorRadioGroup',
  UI_LEVEL_EDITOR_PANEL_X = 'uiLevelEditorPanelX',
  UI_LEVEL_EDITOR_PANEL_Y = 'uiLevelEditorPanelY',
  UI_LEVEL_EDITOR_PANEL_ENTITY = 'uiLevelEditorPanelEntity',
  UI_LEVEL_EDITOR_PANEL_STATE = 'uiLevelEditorPanelState',
  UI_LEVEL_EDITOR_PANEL_ENTITY_PICKER = 'uiLevelEditorPanelEntityPicker',
  UI_LEVEL_EDITOR_PANEL_DECREMENT = 'uiLevelEditorPanelDecrement',
  UI_LEVEL_EDITOR_PANEL_INCREMENT = 'uiLevelEditorPanelIncrement',
  UI_LEVEL_EDITOR_PANEL_REMOVE = 'uiLevelEditorPanelRemove',
  UI_LEVEL_EDITOR_PANEL_ADD = 'uiLevelEditorPanelAdd',
  UI_LEVEL_EDITOR_PANEL_TOGGLE_GRID = 'uiLevelEditorPanelToggleGrid',
  UI_LEVEL_EDITOR_SANDBOX = 'uiLevelEditorSandbox'
}
