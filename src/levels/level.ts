import {Entity} from '../entities/entity'
import {WH} from '../math/wh'

/** Entities within a bounds. */
export interface Level extends WH {
  readonly minSize: WH
  readonly entities: readonly Entity[]
}
