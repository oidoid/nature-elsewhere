import {Updater} from '../../updaters/updater/updater'
import {Entity} from '../../entity/entity'
import {UpdateStatus} from '../../updaters/update-status/update-status'
import {XY} from '../../../math/xy'
import {Rect} from '../../../math/rect'
import {WH} from '../../../math/wh'
import {WHParser} from '../../../math/parsers/wh-parser'

export interface FollowCam {
  readonly positionRelativeToCam: FollowCam.Orientation
  readonly camMargin: WH
}

export namespace FollowCam {
  export interface Config {
    readonly positionRelativeToCam: FollowCam.Orientation
    readonly camMargin?: Partial<WH>
  }

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

  export const parse: Updater.Parse = entity => {
    const orientation =
      'positionRelativeToCam' in entity
        ? entity['positionRelativeToCam']
        : undefined
    if (!orientation || !Object.values(Orientation).includes(orientation))
      throw new Error(`Invalid Orientation "${orientation}".`)
    const camMargin = WHParser.parse(
      'camMargin' in entity ? entity['camMargin'] : undefined
    )
    return {...entity, camMargin}
  }

  export function is(entity: Entity): entity is FollowCam & Entity {
    return entity.updaters.includes(Updater.UI_FOLLOW_CAM)
  }

  export const update: Updater.Update = (entity, state) => {
    if (!is(entity)) throw new Error()
    const to = orientationToXY(
      entity.bounds,
      state.level.cam.bounds,
      entity.camMargin,
      entity.positionRelativeToCam
    )

    if (XY.equal(entity.bounds, to)) return UpdateStatus.UNCHANGED

    Entity.moveTo(entity, to)
    return UpdateStatus.UPDATED

    // const orientation = ObjectUtil.prop(
    //   <FollowCam>(<unknown>entity),
    //   'positionRelativeToCam'
    // )
    // const followCam = ObjectUtil.assertHasKey<FollowCam & Entity>(
    //   entity,
    //   'FollowCam',
    //   'positionRelativeToCam'
    // )
    // ObjectUtil.assertValueOf(Orientation, 'Orientation', followCam.positionRelativeToCam)
  }
}

/** In fractional pixel level coordinates. */
function orientationToXY(
  entity: Rect,
  cam: Rect,
  margin: WH,
  orientation: FollowCam.Orientation
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
  orientation: FollowCam.Orientation
): number {
  let x = cam.x
  switch (orientation) {
    case FollowCam.Orientation.SOUTH_WEST:
    case FollowCam.Orientation.WEST:
    case FollowCam.Orientation.NORTH_WEST:
      x += margin.w
      break
    case FollowCam.Orientation.SOUTH_EAST:
    case FollowCam.Orientation.EAST:
    case FollowCam.Orientation.NORTH_EAST:
      x += cam.w - (entity.w + margin.w)
      break
    case FollowCam.Orientation.NORTH:
    case FollowCam.Orientation.SOUTH:
    case FollowCam.Orientation.CENTER:
      x += cam.w / 2 - (entity.w / 2 + margin.w)
      break
  }
  return x
}

function orientationToY(
  entity: Rect,
  cam: Rect,
  margin: WH,
  orientation: FollowCam.Orientation
): number {
  let y = cam.y
  switch (orientation) {
    case FollowCam.Orientation.NORTH:
    case FollowCam.Orientation.NORTH_EAST:
    case FollowCam.Orientation.NORTH_WEST:
      y += margin.h
      break
    case FollowCam.Orientation.SOUTH_EAST:
    case FollowCam.Orientation.SOUTH:
    case FollowCam.Orientation.SOUTH_WEST:
      y += cam.h - (entity.h + margin.h)
      break
    case FollowCam.Orientation.EAST:
    case FollowCam.Orientation.WEST:
    case FollowCam.Orientation.CENTER:
      y += cam.h / 2 - (entity.h / 2 + margin.h)
      break
  }
  return y
}
