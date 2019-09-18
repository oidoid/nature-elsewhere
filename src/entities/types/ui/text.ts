import {Entity} from '../../entity'
import {EntityType} from '../entity-type'
import {XY} from '../../../math/xy'
import {Layer} from '../../../images/layer'
import {XYConfig} from '../../../math/parsers/xy-config'
import {LayerKeyConfig} from '../../../images/parsers/layer-config'
import {EntityConfig} from '../../parsers/entity-config'
import {WHConfig} from '../../../math/parsers/wh-config'
import {WH} from '../../../math/wh'

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
