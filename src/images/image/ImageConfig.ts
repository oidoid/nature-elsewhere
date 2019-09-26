import {AnimatorConfig} from '../animator/AnimatorConfig'
import {AtlasIDConfig} from '../../atlas/atlasID/AtlasIDConfig'
import {LayerKeyConfig} from '../layer/LayerConfig'
import {AlphaCompositionKeyConfig} from '../alphaComposition/AlphaCompositionConfig'
import {DecamillipixelIntXYConfig} from '../decamillipixelIntXY/DecamillipixelIntXYConfig'
import {XYConfig} from '../../math/xy/XYParser'
import {RectConfig} from '../../math/rect/RectParser'

export interface ImageConfig {
  readonly id: AtlasIDConfig
  readonly imageID?: AtlasIDConfig
  readonly bounds?: RectConfig
  readonly layer?: LayerKeyConfig
  readonly animator?: AnimatorConfig
  readonly scale?: XYConfig
  readonly wrap?: DecamillipixelIntXYConfig
  readonly wrapVelocity?: DecamillipixelIntXYConfig
  readonly alphaComposition?: AlphaCompositionKeyConfig
}
