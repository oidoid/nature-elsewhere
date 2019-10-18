import {WHParser} from '../../math/WHParser'
import {ObjectUtil} from '../../utils/ObjectUtil'
import {WH} from '../../math/WH'
import {FollowCamOrientation, FollowCam} from './FollowCam'
import {EntityConfig} from '../../entity/EntityParser'

export interface FollowCamConfig {
  readonly positionRelativeToCam?: FollowCamOrientation
  readonly camMargin?: Partial<WH>
}

export namespace FollowCamParser {
  export function parse(config: EntityConfig): FollowCam {
    const orientation =
      'positionRelativeToCam' in config
        ? config['positionRelativeToCam']
        : undefined
    if (orientation)
      ObjectUtil.assertValueOf(
        FollowCamOrientation,
        orientation,
        'FollowCamOrientation'
      )
    const camMargin = WHParser.parse(
      'camMargin' in config ? config['camMargin'] : undefined
    )
    return {positionRelativeToCam: orientation, camMargin}
  }
}
