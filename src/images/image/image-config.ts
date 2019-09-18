import {XYConfig} from '../../math/parsers/xy-config'
import {RectConfig} from '../../math/parsers/rect-config'
import {AnimatorConfig} from '../animator/animator-config'
import {AtlasIDConfig} from '../../atlas/atlas-id/atlas-id-config'
import {LayerKeyConfig} from '../layer/layer-config'
import {DecamillipixelIntXYConfig} from '../decamillipixel-int-xy/decamillipixel-int-xy-config'

export interface ImageConfig {
  readonly id: AtlasIDConfig
  readonly bounds?: RectConfig
  readonly layer?: LayerKeyConfig
  readonly animator?: AnimatorConfig
  readonly scale?: XYConfig
  readonly wrap?: DecamillipixelIntXYConfig
  readonly wrapVelocity?: DecamillipixelIntXYConfig
}
