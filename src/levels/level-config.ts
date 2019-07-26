import {EntityConfig} from '../entities/entity-config'
import {LevelID} from './level-id'

export interface LevelConfig extends WH {
  readonly id: keyof typeof LevelID | string
  readonly minSize: WH
  readonly entities: readonly EntityConfig[]
}
