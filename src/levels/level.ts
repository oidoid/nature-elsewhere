import * as Entity from '../entities/entity'

/** Entities within a bounds. */
export interface Level extends WH {
  readonly minSize: WH
  readonly entities: readonly Entity.State[]
}
