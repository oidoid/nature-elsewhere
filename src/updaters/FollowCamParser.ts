import {FollowCam} from './FollowCam'
import {FollowCamConfig} from './FollowCamConfig'
import {WHParser} from '../math/WHParser'

export namespace FollowCamParser {
  export function parse(config: FollowCamConfig): FollowCam {
    const orientation =
      'positionRelativeToCam' in config
        ? config['positionRelativeToCam']
        : undefined
    if (
      orientation &&
      !Object.values(FollowCam.Orientation).includes(
        <FollowCam.Orientation>orientation
      )
    )
      throw new Error(`Unknown FollowCam.Orientation "${orientation}".`)
    const camMargin = WHParser.parse(
      'camMargin' in config ? config['camMargin'] : undefined
    )

    const cam: Writable<FollowCam> = {camMargin}
    if (orientation !== undefined)
      cam.positionRelativeToCam = <FollowCam.Orientation>orientation
    return cam
  }
}
