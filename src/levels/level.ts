import {EntityRect} from '../entities/entity-rect'
import {WH} from '../math/wh'

/** Entities within a bounds. */
export interface Level extends Omit<EntityRect, 'x' | 'y'> {
  readonly id: string
  readonly minSize: WH
}
