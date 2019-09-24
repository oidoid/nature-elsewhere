import {XYConfig} from '../../math/xy/XYConfig'
import {RectConfig} from '../../math/rect/RectConfig'
import {AnimatorConfig} from '../animator/AnimatorConfig'
import {AtlasIDConfig} from '../../atlas/atlasID/AtlasIDConfig'
import {LayerKeyConfig} from '../layer/LayerConfig'
import {DecamillipixelIntXYConfig} from '../decamillipixelIntXY/DecamillipixelIntXYConfig'

export interface ImageConfig {
  readonly id: AtlasIDConfig
  readonly colorID?: AtlasIDConfig
  readonly bounds?: RectConfig
  readonly layer?: LayerKeyConfig
  readonly animator?: AnimatorConfig
  readonly scale?: XYConfig
  readonly wrap?: DecamillipixelIntXYConfig
  readonly wrapVelocity?: DecamillipixelIntXYConfig
}
