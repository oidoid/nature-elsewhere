import {FollowCamOrientation} from './FollowCamOrientation'
import {WH} from '../../../../math/wh/WH'

export interface FollowCamConfig {
  readonly positionRelativeToCam: FollowCamOrientation
  readonly camMargin?: Partial<WH>
}
