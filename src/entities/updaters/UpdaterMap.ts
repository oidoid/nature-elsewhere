import {UpdaterType} from './updaterType/UpdaterType'
import {UpdateStatus} from './updateStatus/UpdateStatus'
import {LevelEditorPanelUpdater} from '../types/levelEditorPanel/LevelEditorPanelUpdater'
import {ButtonUpdater} from '../types/button/ButtonUpdater'
import {Link} from './types/link/Link'
import {CursorUpdater} from '../types/cursor/CursorUpdater'
import {Update} from './Update'
import {CheckboxUpdater} from '../types/checkbox/CheckboxUpdater'
import {DestinationMarkerUpdater} from '../types/destinationMarker/DestinationMarkerUpdater'
import {BackpackerUpdater} from '../types/backpacker/BackpackerUpdater'
import {FollowCamUpdater} from './types/followCam/FollowCamUpdater'
import {LevelLinkUpdater} from './types/levelLink/LevelLinkUpdater'
import {MarqueeUpdater} from '../types/marquee/MarqueeUpdater'

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
  [UpdaterType.UI_FOLLOW_CAM]: FollowCamUpdater.update,
  [UpdaterType.UI_BUTTON]: ButtonUpdater.update,
  [UpdaterType.UI_CHECKBOX]: CheckboxUpdater.update,
  [UpdaterType.UI_LINK]: Link.update,
  [UpdaterType.UI_LEVEL_LINK]: LevelLinkUpdater.update,
  [UpdaterType.UI_DESTINATION_MARKER]: DestinationMarkerUpdater.update,
  [UpdaterType.CHAR_BACKPACKER]: BackpackerUpdater.update,
  [UpdaterType.UI_MARQUEE]: MarqueeUpdater.update
}
