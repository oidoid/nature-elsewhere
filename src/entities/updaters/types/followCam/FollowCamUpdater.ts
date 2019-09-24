import {Entity} from '../../../entity/Entity'
import {FollowCam} from './FollowCam'
import {UpdaterType} from '../../updaterType/UpdaterType'
import {Update} from '../../Update'
import {EntityUtil} from '../../../entity/EntityUtil'
import {UpdateStatus} from '../../updateStatus/UpdateStatus'
import {XY} from '../../../../math/xy/XY'
import {Rect} from '../../../../math/rect/Rect'
import {WH} from '../../../../math/wh/WH'
import {FollowCamOrientation} from './FollowCamOrientation'

export namespace FollowCamUpdater {
  export function is(entity: Entity): entity is FollowCam & Entity {
    return entity.updaters.includes(UpdaterType.UI_FOLLOW_CAM)
  }

  export const update: Update = (entity, state) => {
    if (!is(entity)) throw new Error()
    const to = orientationToXY(
      entity.bounds,
      state.level.cam.bounds,
      entity.camMargin,
      entity.positionRelativeToCam
    )

    if (XY.equal(entity.bounds.position, to)) return UpdateStatus.UNCHANGED

    return EntityUtil.moveTo(entity, to)
  }
}

/** In fractional pixel level coordinates. */
function orientationToXY(
  entity: Rect,
  cam: Rect,
  margin: WH,
  orientation: FollowCamOrientation
): XY {
  return {
    x: orientationToX(entity, cam, margin, orientation),
    y: orientationToY(entity, cam, margin, orientation)
  }
}

function orientationToX(
  entity: Rect,
  cam: Rect,
  margin: WH,
  orientation: FollowCamOrientation
): number {
  let x = cam.position.x
  switch (orientation) {
    case FollowCamOrientation.SOUTH_WEST:
    case FollowCamOrientation.WEST:
    case FollowCamOrientation.NORTH_WEST:
      x += margin.w
      break
    case FollowCamOrientation.SOUTH_EAST:
    case FollowCamOrientation.EAST:
    case FollowCamOrientation.NORTH_EAST:
      x += cam.size.w - (entity.size.w + margin.w)
      break
    case FollowCamOrientation.NORTH:
    case FollowCamOrientation.SOUTH:
    case FollowCamOrientation.CENTER:
      x +=
        Math.trunc(cam.size.w / 2) - (Math.trunc(entity.size.w / 2) + margin.w)
      break
  }
  return x
}

function orientationToY(
  entity: Rect,
  cam: Rect,
  margin: WH,
  orientation: FollowCamOrientation
): number {
  let y = cam.position.y
  switch (orientation) {
    case FollowCamOrientation.NORTH:
    case FollowCamOrientation.NORTH_EAST:
    case FollowCamOrientation.NORTH_WEST:
      y += margin.h
      break
    case FollowCamOrientation.SOUTH_EAST:
    case FollowCamOrientation.SOUTH:
    case FollowCamOrientation.SOUTH_WEST:
      y += cam.size.h - (entity.size.h + margin.h)
      break
    case FollowCamOrientation.EAST:
    case FollowCamOrientation.WEST:
    case FollowCamOrientation.CENTER:
      y +=
        Math.trunc(cam.size.h / 2) - (Math.trunc(entity.size.h / 2) + margin.h)
      break
  }
  return y
}
