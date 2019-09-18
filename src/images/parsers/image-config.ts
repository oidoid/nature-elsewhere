import {XYConfig} from '../../math/parsers/xy-config'
import {RectConfig} from '../../math/parsers/rect-config'
import {AnimatorConfig} from './animator-config'
import {AnimationIDConfig} from '../../atlas/animation-id-config'
import {LayerKeyConfig} from './layer-config'
import {MillipixelIntXYConfig} from './millipixel-int-xy-config'

export interface ImageConfig {
  readonly id: AnimationIDConfig
  readonly bounds?: RectConfig
  readonly layer?: LayerKeyConfig
  readonly animator?: AnimatorConfig
  readonly scale?: XYConfig
  readonly wrap?: MillipixelIntXYConfig
  readonly wrapVelocity?: MillipixelIntXYConfig
}
