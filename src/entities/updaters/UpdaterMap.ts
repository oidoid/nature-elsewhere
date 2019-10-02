import {Backpacker} from '../types/backpacker/Backpacker'
import {Button} from '../types/button/Button'
import {CheckboxUpdater} from '../types/checkbox/CheckboxUpdater'
import {Cursor} from '../types/cursor/Cursor'
import {DestinationMarker} from '../types/destinationMarker/DestinationMarker'
import {FollowCamUpdater} from './types/followCam/FollowCamUpdater'
import {LevelEditorPanelUpdater} from '../types/levelEditorPanel/LevelEditorPanelUpdater'
import {LevelLinkUpdater} from './types/levelLink/LevelLinkUpdater'
import {Link} from './types/link/Link'
import {MarqueeUpdater} from '../types/marquee/MarqueeUpdater'
import {Update} from './Update'
import {UpdaterType} from './updaterType/UpdaterType'
import {UpdateStatus} from './updateStatus/UpdateStatus'
import {NumberUtil} from '../../math/NumberUtil'
import {Entity} from '../../entity/Entity'
import {XY} from '../../math/XY'

const wraparound: Update = (entity, state) => {
  const {bounds} = entity
  const destination = new XY(
    NumberUtil.wrap(
      bounds.position.x,
      -bounds.size.w + 1, // 8 works but not 1
      state.level.size.w - 1
    ),
    NumberUtil.wrap(
      bounds.position.y,
      -bounds.size.h + 1,
      state.level.size.h - 1
    )
  )
  return Entity.moveTo(entity, destination)
}

export const UpdaterMap: Readonly<Record<UpdaterType, Update>> = {
  [UpdaterType.NO_UPDATE]() {
    return UpdateStatus.UNCHANGED
  },
  [UpdaterType.CHAR_BACKPACKER]: Backpacker.update,
  [UpdaterType.CIRCLE]: wraparound,
  [UpdaterType.UI_BUTTON]: Button.update,
  [UpdaterType.UI_CHECKBOX]: CheckboxUpdater.update,
  [UpdaterType.UI_CURSOR]: Cursor.update,
  [UpdaterType.UI_DESTINATION_MARKER]: DestinationMarker.update,
  [UpdaterType.UI_FOLLOW_CAM]: FollowCamUpdater.update,
  [UpdaterType.UI_LEVEL_EDITOR_PANEL]: LevelEditorPanelUpdater.update,
  [UpdaterType.UI_LEVEL_LINK]: LevelLinkUpdater.update,
  [UpdaterType.UI_LINK]: Link.update,
  [UpdaterType.UI_MARQUEE]: MarqueeUpdater.update,
  [UpdaterType.WRAPAROUND]: wraparound
}
export type UpdaterMap = typeof UpdaterMap[keyof typeof UpdaterMap]
