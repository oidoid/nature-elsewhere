import {Atlas} from '../atlas/atlas'
import {Behavior} from './behavior'
import {EntityID} from './entity-id'
import {Image} from '../images/image'
import {ImageRect} from '../images/image-rect'
import {Rect} from '../math/rect'
import {UpdateType} from '../store/update-type'

/** Images and behavior. Bounds (x, y, w, and h members) are the union of all
    Entity images. This is used for quick collision detections such checking if
    the Entity is on screen. x and y are in in level coordinates. */
export interface Entity extends ImageRect, Rect {
  readonly id: EntityID.Key
  /** Random number initial value or variant. */

  readonly state: string
  readonly updateType: UpdateType.Key
  readonly behavior: Behavior.Key
  readonly sx: number
  readonly sy: number
  readonly vx: number
  readonly vy: number
  readonly ax: number
  readonly ay: number
}

export namespace Entity {
  export function update(
    state: Mutable<Entity>,
    atlas: Atlas,
    cam: Rect,
    time: number
  ): readonly Image[] {
    if (state.updateType === 'NEVER') return state.images
    ;(state.vx += state.ax), (state.vy += state.ay)
    Behavior[state.behavior](state, cam)
    state.images.forEach(img => Image.animate(img, atlas, time))
    return state.images
  }
}
