import {Atlas} from '../atlas/atlas'
import {Behavior} from './behavior'
import {Image} from '../images/image'
import {ImageRect} from '../images/image-rect'
import {Recorder} from '../inputs/recorder'
import {Rect} from '../math/rect'
import {UpdateType} from '../store/update-type'
import {XY} from '../math/xy'
import {Level} from '../levels/level'

/** Images and behavior. */
export interface Entity {
  readonly id: string
  readonly state: string
  readonly updateType: UpdateType.Key
  readonly behavior: Behavior.Key
  readonly collisions: readonly Rect[]
  readonly scale: Mutable<XY>
  readonly vx: number
  readonly vy: number
  readonly ax: number
  readonly ay: number
  readonly states: Record<string, ImageRect>
}
type t = Entity

export namespace Entity {
  export const update = (
    val: Mutable<t>,
    entities: readonly t[],
    level: Level,
    atlas: Atlas,
    cam: Rect,
    time: number,
    recorder: Recorder
  ): readonly Image[] => {
    if (val.updateType === 'NEVER') return val.states[val.state].images
    ;(val.vx += val.ax * time), (val.vy += val.ay * time)
    Behavior[val.behavior](val, entities, level, atlas, cam, recorder)
    const rect = val.states[val.state]
    rect.images.forEach(img => Image.animate(img, atlas, time))
    return rect.images
  }
}
