import * as Atlas from '../atlas/atlas'
import {EntityID} from './entity-id'
import * as Image from '../images/image'
import * as ImageRect from '../images/image-rect'

/** Images and behavior. Bounds (x, y, w, and h members) are the union of all
    Entity images. This is used for quick collision detections such checking if
    the Entity is on screen. x and y are in in level coordinates. */
export interface State extends Mutable<ImageRect.State & Rect> {
  readonly id: keyof typeof EntityID
  /** Random number initial value or variant. */
  readonly seed: number
  inactive: boolean
  velocity: Mutable<XY>
  acceleration: Mutable<XY>
}

export function update(
  state: State,
  atlas: Atlas.State,
  time: number
): readonly Readonly<Image.State>[] {
  if (state.inactive) return state.images
  state.images.forEach(img => Image.animate(img, atlas, time))
  return state.images
}
