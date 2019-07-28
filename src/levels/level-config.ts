import {EntityConfig} from '../entities/entity-config'
import {LevelID} from './level-id'
import {WH} from '../math/wh'

export interface LevelConfig extends WH {
  readonly id: LevelID.Key | string
  readonly minSize: WH
  readonly entities: readonly EntityConfig[]
}
