import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'
import {XY} from '../../../math/xy/xy'
import {Layer} from '../../../images/layer/layer'
import {WH} from '../../../math/wh/wh'

export interface Text extends Entity {
  readonly type: EntityType.UI_TEXT
  text: string
  readonly textLayer: Layer.Key
  readonly textScale: XY
  readonly textMaxSize: WH
}
