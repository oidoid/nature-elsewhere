import {Rect} from '../../math/rect/rect'
import {EntityID} from '../../entities/entity-id/entity-id'

export interface Camera {
  readonly bounds: Writable<Rect>
  /** EntityID.ANONYMOUS if not following. */
  followID: EntityID
}
