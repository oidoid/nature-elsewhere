import {Entity} from '../../../entity/Entity'
import {EntityType} from '../../../entity/EntityType'
import {XY} from '../../../math/XY'
import {Layer} from '../../../image/Layer'
import {WH} from '../../../math/WH'

export interface Text extends Entity {
  readonly type: EntityType.UI_TEXT
  text: string
  readonly textLayer: Layer.Key
  readonly textScale: XY
  readonly textMaxSize: WH
}
