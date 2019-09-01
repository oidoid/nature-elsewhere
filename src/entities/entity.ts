import {Atlas} from '../atlas/atlas'
import {Behavior} from './behavior'
import {Image} from '../images/image'
import {ImageRect} from '../images/image-rect'
import {Recorder} from '../inputs/recorder'
import {Rect} from '../math/rect'
import {UpdateType} from '../store/update-type'
import {XY} from '../math/xy'

/** Images and behavior. Bounds (x, y, w, and h members) are the union of all
    Entity images. This is used for quick collision detections such checking if
    the Entity is on screen. x and y are in in level coordinates. */
export interface Entity
  extends ImageRect,
    Omit<Required<Entity.Config>, 'images' | 'states'> {
  readonly updateType: UpdateType.Key
  readonly behavior: Behavior.Key
}

export namespace Entity {
  export interface Config extends Partial<XY> {
    readonly id?: string
    readonly state?: string
    readonly updateType?: UpdateType.Key | string
    readonly behavior?: Behavior.Key | string
    readonly sx?: number
    readonly sy?: number
    readonly vx?: number
    readonly vy?: number
    readonly ax?: number
    readonly ay?: number
    readonly images?: readonly Image.Config[]
    readonly states?: Readonly<Record<string, readonly Image.Config[]>>
  }

  export function update(
    state: Mutable<Entity>,
    atlas: Atlas,
    cam: Rect,
    time: number,
    recorder: Recorder
  ): readonly Image[] {
    if (state.updateType === 'NEVER') return state.images
    ;(state.vx += state.ax * time), (state.vy += state.ay * time)
    Behavior[state.behavior](state, cam, recorder)
    state.images.forEach(img => Image.animate(img, atlas, time))
    return state.images
  }
}
