import {FollowCamUpdater} from './followCam/FollowCamUpdater'
import {NumberUtil} from '../math/NumberUtil'
import {Update} from './Update'
import {UpdateStatus} from './updateStatus/UpdateStatus'
import {UpdaterType} from './updaterType/UpdaterType'
import {XY} from '../math/XY'

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
  [UpdaterType.WRAPAROUND]: wraparound
}
export type UpdaterMap = typeof UpdaterMap[keyof typeof UpdaterMap]
