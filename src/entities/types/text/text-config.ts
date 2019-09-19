import {EntityConfig} from '../../entity/entity-config'
import {EntityType} from '../../entity-type/entity-type'
import {LayerKeyConfig} from '../../../images/layer/layer-config'
import {WHConfig} from '../../../math/wh/wh-config'
import {XYConfig} from '../../../math/xy/xy-config'

export interface TextConfig extends EntityConfig {
  readonly type: EntityType.UI_TEXT
  readonly text?: string
  readonly textLayer: LayerKeyConfig
  readonly textScale?: XYConfig
  readonly textMaxSize?: WHConfig
}
