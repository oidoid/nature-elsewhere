import {UpdaterType} from './updater-type/updater-type'
import {UpdateStatus} from './update-status/update-status'
import {FollowCam} from '../types/follow-cam/follow-cam'
import {LevelLink} from '../types/level-link/level-link'
import {LevelEditorPanelUpdater} from '../types/level-editor-panel/level-editor-panel-updater'
import {ButtonUpdater} from '../types/button/button-updater'
import {Link} from '../types/link/link'
import {CursorUpdater} from '../types/cursor/cursor-updater'
import {Update} from './update'
import {CheckboxUpdater} from '../types/checkbox/checkbox-updater'
import {DestinationMarkerUpdater} from '../types/destination-marker/destination-marker-updater'
import {BackpackerUpdater} from '../types/backpacker/backpacker-updater'

const wraparound: Update = () => {
  return UpdateStatus.UNCHANGED
}

export const UpdaterMap: Readonly<Record<UpdaterType, Update>> = {
  [UpdaterType.NO_UPDATE]() {
    return UpdateStatus.UNCHANGED
  },
  [UpdaterType.UI_LEVEL_EDITOR_PANEL]: LevelEditorPanelUpdater.update,
  [UpdaterType.WRAPAROUND]: wraparound,
  [UpdaterType.CIRCLE]: wraparound,
  [UpdaterType.UI_CURSOR]: CursorUpdater.update,
  [UpdaterType.UI_FOLLOW_CAM]: FollowCam.update,
  [UpdaterType.UI_BUTTON]: ButtonUpdater.update,
  [UpdaterType.UI_CHECKBOX]: CheckboxUpdater.update,
  [UpdaterType.UI_LINK]: Link.update,
  [UpdaterType.UI_LEVEL_LINK]: LevelLink.update,
  [UpdaterType.UI_DESTINATION_MARKER]: DestinationMarkerUpdater.update,
  [UpdaterType.CHAR_BACKPACKER]: BackpackerUpdater.update
}
