import * as Entity from '../entities/entity'

export interface LevelConfig extends WH {
  readonly minSize: WH
  readonly entities: readonly (Entity.Config | {readonly type: string})[]
}
