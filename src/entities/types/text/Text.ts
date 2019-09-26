import {Entity} from '../../../entity/Entity'
import {EntityType} from '../../../entity/EntityType'
import {XY} from '../../../math/xy/XY'
import {Layer} from '../../../images/layer/Layer'
import {WH} from '../../../math/wh/WH'

export interface Text extends Entity {
  readonly type: EntityType.UI_TEXT
  text: string
  readonly textLayer: Layer.Key
  readonly textScale: XY
  readonly textMaxSize: WH
}
