import {Rect} from '../../math/rect'
import {EntityID} from '../../entities/entity-id/entity-id'

export interface Camera {
  readonly bounds: Writable<Rect>
  /** EntityID.UNDEFINED if not following. */
  followID: EntityID
}
