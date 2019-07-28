import {Atlas} from '../atlas/atlas'
import {EntityID} from './entity-id'
import {Image} from '../images/image'
import {ImageRect} from '../images/image-rect'
import {Rect} from '../math/rect'
import {XY} from '../math/xy'

/** Images and behavior. Bounds (x, y, w, and h members) are the union of all
    Entity images. This is used for quick collision detections such checking if
    the Entity is on screen. x and y are in in level coordinates. */
export interface Entity extends ImageRect, Rect {
  readonly id: EntityID.Key
  /** Random number initial value or variant. */
  readonly seed: number
  readonly inactive: boolean
  readonly velocity: XY
  readonly acceleration: XY
}

export namespace Entity {
  export function update(
    state: Entity,
    atlas: Atlas,
    time: number
  ): readonly Image[] {
    if (state.inactive) return state.images
    state.images.forEach(img => Image.animate(img, atlas, time))
    return state.images
  }
}
