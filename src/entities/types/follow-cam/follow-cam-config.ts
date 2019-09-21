import {FollowCamOrientation} from './follow-cam-orientation'
import {WH} from '../../../math/wh/wh'

export interface FollowCamConfig {
  readonly positionRelativeToCam: FollowCamOrientation
  readonly camMargin?: Partial<WH>
}
