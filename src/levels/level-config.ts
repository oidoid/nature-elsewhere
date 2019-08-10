import {EntityConfig} from '../entities/entity-config'
import {WH} from '../math/wh'

export interface LevelConfig extends WH {
  readonly id: string
  readonly minSize: WH
  readonly entities: readonly EntityConfig[]
}
