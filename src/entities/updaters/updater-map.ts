import {Updater} from './updater/updater'
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

export namespace UpdaterMap {
  export const Update: Readonly<Record<Updater, Update>> = {
    [Updater.NO_UPDATE]() {
      return UpdateStatus.UNCHANGED
    },
    [Updater.UI_LEVEL_EDITOR_PANEL]: LevelEditorPanelUpdater.update,
    [Updater.WRAPAROUND]: wraparound,
    [Updater.CIRCLE]: wraparound,
    [Updater.UI_CURSOR]: CursorUpdater.update,
    [Updater.UI_FOLLOW_CAM]: FollowCam.update,
    [Updater.UI_BUTTON]: ButtonUpdater.update,
    [Updater.UI_CHECKBOX]: CheckboxUpdater.update,
    [Updater.UI_LINK]: Link.update,
    [Updater.UI_LEVEL_LINK]: LevelLink.update,
    [Updater.UI_DESTINATION_MARKER]: DestinationMarkerUpdater.update,
    [Updater.CHAR_BACKPACKER]: BackpackerUpdater.update
  }
}
