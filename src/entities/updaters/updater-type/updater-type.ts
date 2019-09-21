/** See UpdatePredicate. */
export enum UpdaterType {
  NO_UPDATE = 'noUpdate', // i think i need this for animation? can i move it just to updatepredicate.never?
  UI_LEVEL_EDITOR_PANEL = 'uiLevelEditorPanel',
  WRAPAROUND = 'wraparound',
  CIRCLE = 'circle',
  UI_CURSOR = 'uiCursor',
  UI_FOLLOW_CAM = 'uiFollowCam',
  UI_BUTTON = 'uiButton',
  UI_CHECKBOX = 'uiCheckbox',
  UI_LINK = 'uiLink',
  UI_LEVEL_LINK = 'uiLevelLink',
  UI_DESTINATION_MARKER = 'uiDestinationMarker',
  CHAR_BACKPACKER = 'charBackpacker'
}
