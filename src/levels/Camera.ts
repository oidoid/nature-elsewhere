import {Rect} from '../math/Rect'
import {EntityID} from '../entity/EntityID'

export interface Camera {
  readonly bounds: Rect
  /** EntityID.ANONYMOUS if not following. */
  followID: EntityID
}
