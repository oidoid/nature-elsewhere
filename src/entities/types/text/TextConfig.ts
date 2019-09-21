import {EntityConfig} from '../../entity/EntityConfig'
import {EntityType} from '../../entityType/EntityType'
import {LayerKeyConfig} from '../../../images/layer/LayerConfig'
import {WHConfig} from '../../../math/wh/WHConfig'
import {XYConfig} from '../../../math/xy/XYConfig'

export interface TextConfig extends EntityConfig {
  readonly type: EntityType.UI_TEXT
  readonly text?: string
  readonly textLayer: LayerKeyConfig
  readonly textScale?: XYConfig
  readonly textMaxSize?: WHConfig
}
