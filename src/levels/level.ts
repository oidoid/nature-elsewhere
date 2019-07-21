import * as Entity from '../entities/entity'

export interface Level extends WH {
  readonly minSize: WH
  readonly entities: readonly Entity.State[]
}
