import {Backpacker} from '../types/backpacker/Backpacker'
import {ButtonUpdater} from '../types/button/ButtonUpdater'
import {CheckboxUpdater} from '../types/checkbox/CheckboxUpdater'
import {CursorUpdater} from '../types/cursor/CursorUpdater'
import {DestinationMarkerUpdater} from '../types/destinationMarker/DestinationMarkerUpdater'
import {FollowCamUpdater} from './types/followCam/FollowCamUpdater'
import {LevelEditorPanelUpdater} from '../types/levelEditorPanel/LevelEditorPanelUpdater'
import {LevelLinkUpdater} from './types/levelLink/LevelLinkUpdater'
import {Link} from './types/link/Link'
import {MarqueeUpdater} from '../types/marquee/MarqueeUpdater'
import {Update} from './Update'
import {UpdaterType} from './updaterType/UpdaterType'
import {UpdateStatus} from './updateStatus/UpdateStatus'

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
  [UpdaterType.CHAR_BACKPACKER]: Backpacker.update,
  [UpdaterType.UI_MARQUEE]: MarqueeUpdater.update
}
