import {EntityID} from '../entities/entity-id'
import {Rect} from '../math/rect'

export interface Camera {
  readonly bounds: Writable<Rect>
  /** EntityID.UNDEFINED if not following. */
  followID: EntityID
}
