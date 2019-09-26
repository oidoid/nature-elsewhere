import {EntityType} from '../../entityType/EntityType'
import {LayerKeyConfig} from '../../../images/layer/LayerConfig'
import {EntityConfig} from '../../entity/EntityParser'
import {XYConfig} from '../../../math/xy/XYParser'
import {WHConfig} from '../../../math/wh/WHParser'

export interface TextConfig extends EntityConfig {
  readonly type: EntityType.UI_TEXT
  readonly text?: string
  readonly textLayer: LayerKeyConfig
  readonly textScale?: XYConfig
  readonly textMaxSize?: WHConfig
}
