import {EntityConfig} from '../../entity/EntityConfig'
import {LayerConfig} from '../../sprite/LayerConfig'
import {WHConfig} from '../../math/WHConfig'
import {XYConfig} from '../../math/XYConfig'

export interface TextPropsConfig extends EntityConfig {
  readonly text?: string
  readonly textLayer?: LayerConfig
  readonly textScale?: XYConfig
  readonly textMaxSize?: WHConfig
}
