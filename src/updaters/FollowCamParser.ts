import {EntityConfig} from '../entity/EntityConfig'
import {FollowCam} from './FollowCam'
import {WH} from '../math/WH'
import {WHParser} from '../math/WHParser'

export interface FollowCamConfig {
  readonly positionRelativeToCam?: FollowCam.Orientation
  readonly camMargin?: Partial<WH>
}

export namespace FollowCamParser {
  export function parse(config: EntityConfig): FollowCam {
    const orientation =
      'positionRelativeToCam' in config
        ? config['positionRelativeToCam']
        : undefined
    if (
      orientation &&
      !Object.values(FollowCam.Orientation).includes(orientation)
    )
      throw new Error(`Unknown FollowCam.Orientation "${orientation}".`)
    const camMargin = WHParser.parse(
      'camMargin' in config ? config['camMargin'] : undefined
    )
    return {positionRelativeToCam: orientation, camMargin}
  }
}
