import {WH} from '../../../../math/WH'
import {FollowCamOrientation} from './FollowCamOrientation'

export interface FollowCam {
  readonly positionRelativeToCam: FollowCamOrientation
  readonly camMargin: WH
}
