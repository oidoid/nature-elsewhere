import {FollowCam} from './FollowCam'
import {WHConfig} from '../math/WHConfig'

export interface FollowCamConfig {
  readonly positionRelativeToCam?: Maybe<FollowCam.Orientation | string>
  readonly camMargin?: WHConfig
}
