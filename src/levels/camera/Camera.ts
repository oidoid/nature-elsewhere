import {Rect} from '../../math/rect/Rect'
import {EntityID} from '../../entities/entityID/EntityID'

export interface Camera {
  readonly bounds: Rect
  /** EntityID.ANONYMOUS if not following. */
  followID: EntityID
}
