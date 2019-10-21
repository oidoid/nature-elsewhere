import {Entity} from '../entity/Entity'
import {ReadonlyRect} from '../math/Rect'
import {UpdateState} from './UpdateState'
import {UpdateStatus} from './UpdateStatus'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

export interface FollowCam {
  readonly positionRelativeToCam?: FollowCam.Orientation
  readonly camMargin: WH
}

export interface ReadonlyFollowCam {
  readonly positionRelativeToCam?: FollowCam.Orientation
  readonly camMargin: Readonly<WH>
}

export namespace FollowCam {
  /** The position relative the camera's bounding rectangle. */
  export enum Orientation {
    /** Top-center. */
    NORTH = 'north',
    /** Top-right. */
    NORTH_EAST = 'northEast',
    /** Mid-right. */
    EAST = 'east',
    /** Bottom-right. */
    SOUTH_EAST = 'southEast',
    /** Bottom-center. */
    SOUTH = 'south',
    /** Bottom-left. */
    SOUTH_WEST = 'southWest',
    /** Mid-left. */
    WEST = 'west',
    /** Top-left. */
    NORTH_WEST = 'northWest',
    CENTER = 'center'
  }

  export function update(
    {positionRelativeToCam, camMargin}: ReadonlyFollowCam,
    entity: Entity,
    state: UpdateState
  ): UpdateStatus {
    if (!positionRelativeToCam) return UpdateStatus.UNCHANGED

    const to = orientationToXY(
      entity.bounds,
      state.level.cam.bounds,
      camMargin,
      positionRelativeToCam
    )

    return entity.moveBoundsTo(to)
  }
}

/** In fractional pixel level coordinates. */
function orientationToXY(
  entity: ReadonlyRect,
  cam: ReadonlyRect,
  margin: Readonly<WH>,
  orientation: FollowCam.Orientation
): XY {
  return new XY(
    orientationToX(entity, cam, margin, orientation),
    orientationToY(entity, cam, margin, orientation)
  )
}

function orientationToX(
  entity: ReadonlyRect,
  cam: ReadonlyRect,
  margin: Readonly<WH>,
  orientation: FollowCam.Orientation
): number {
  let x = cam.position.x
  switch (orientation) {
    case FollowCam.Orientation.SOUTH_WEST:
    case FollowCam.Orientation.WEST:
    case FollowCam.Orientation.NORTH_WEST:
      x += margin.w
      break
    case FollowCam.Orientation.SOUTH_EAST:
    case FollowCam.Orientation.EAST:
    case FollowCam.Orientation.NORTH_EAST:
      x += cam.size.w - (entity.size.w + margin.w)
      break
    case FollowCam.Orientation.NORTH:
    case FollowCam.Orientation.SOUTH:
    case FollowCam.Orientation.CENTER:
      x +=
        Math.trunc(cam.size.w / 2) - (Math.trunc(entity.size.w / 2) + margin.w)
      break
  }
  return x
}

function orientationToY(
  entity: ReadonlyRect,
  cam: ReadonlyRect,
  margin: Readonly<WH>,
  orientation: FollowCam.Orientation
): number {
  let y = cam.position.y
  switch (orientation) {
    case FollowCam.Orientation.NORTH:
    case FollowCam.Orientation.NORTH_EAST:
    case FollowCam.Orientation.NORTH_WEST:
      y += margin.h
      break
    case FollowCam.Orientation.SOUTH_EAST:
    case FollowCam.Orientation.SOUTH:
    case FollowCam.Orientation.SOUTH_WEST:
      y += cam.size.h - (entity.size.h + margin.h)
      break
    case FollowCam.Orientation.EAST:
    case FollowCam.Orientation.WEST:
    case FollowCam.Orientation.CENTER:
      y +=
        Math.trunc(cam.size.h / 2) - (Math.trunc(entity.size.h / 2) + margin.h)
      break
  }
  return y
}
