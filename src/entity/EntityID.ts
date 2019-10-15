/** Identifier, not necessarily unique, specified at creation time as needed to
    distinguish among instances of the same type. For example, two entities may
    both be of type "bee" but have "happy" and "angry" IDs. */
export enum EntityID {
  ANONYMOUS = 'anonymous',
  UI_GRID = 'uiGrid',
  UI_MARQUEE = 'uiMarquee',
  UI_PLAYER = 'uiPlayer',
  UI_LEVEL_EDITOR_MENU_EXPORT = 'uiLevelEditorMenuExport',
  UI_LEVEL_EDITOR_MENU_IMPORT = 'uiLevelEditorMenuImport',
  UI_LEVEL_EDITOR_MENU_RESET = 'uiLevelEditorMenuReset',
  UI_LEVEL_EDITOR_MENU_RESTORE_BACKUP = 'uiLevelEditorMenuRestoreBackup',
  UI_LEVEL_EDITOR_MENU_BACK_TO_TITLE = 'uiLevelEditorMenuBackToTitle',
  UI_LEVEL_EDITOR_MENU_BACK_TO_EDITOR = 'uiLevelEditorMenuBackToEditor'
}
