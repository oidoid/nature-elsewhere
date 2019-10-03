import {FollowCamUpdater} from './types/followCam/FollowCamUpdater'
import {LevelLinkUpdater} from './types/levelLink/LevelLinkUpdater'
import {Update} from './Update'
import {UpdaterType} from './updaterType/UpdaterType'
import {UpdateStatus} from './updateStatus/UpdateStatus'
import {NumberUtil} from '../../math/NumberUtil'
import {XY} from '../../math/XY'
import {LinkUpdater} from './types/link/LinkUpdater'

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
  return entity.moveTo(destination)
}

export const UpdaterMap: Readonly<Record<UpdaterType, Update>> = {
  [UpdaterType.NO_UPDATE]() {
    return UpdateStatus.UNCHANGED
  },
  [UpdaterType.CIRCLE]: wraparound,
  [UpdaterType.UI_FOLLOW_CAM]: FollowCamUpdater.update,
  [UpdaterType.UI_LEVEL_LINK]: LevelLinkUpdater.update,
  [UpdaterType.UI_LINK]: LinkUpdater.update,
  [UpdaterType.WRAPAROUND]: wraparound
}
export type UpdaterMap = typeof UpdaterMap[keyof typeof UpdaterMap]
