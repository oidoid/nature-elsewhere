import {WH} from '../math/wh'
import {EntityConfig} from '../entities/entity-config'
import {EntityRectConfig} from '../entities/entity-rect-config'

export interface LevelConfig extends WH {
  readonly id: string
  readonly minSize: WH
  readonly entities: readonly (EntityConfig | EntityRectConfig)[]
}
