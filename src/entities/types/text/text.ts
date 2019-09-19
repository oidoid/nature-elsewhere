import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'
import {XY} from '../../../math/xy/xy'
import {Layer} from '../../../images/layer/layer'
import {XYConfig} from '../../../math/xy/xy-config'
import {LayerKeyConfig} from '../../../images/layer/layer-config'
import {EntityConfig} from '../../entity/entity-config'
import {WHConfig} from '../../../math/wh/wh-config'
import {WH} from '../../../math/wh/wh'

export interface Text extends Entity {
  readonly type: EntityType.UI_TEXT
  text: string
  readonly textLayer: Layer.Key
  readonly textScale: XY
  readonly textMaxSize: WH
}

export namespace Text {
  export interface Config extends EntityConfig {
    readonly type: EntityType.UI_TEXT
    text?: string
    textLayer: LayerKeyConfig
    textScale?: XYConfig
    textMaxSize?: WHConfig
  }
}
