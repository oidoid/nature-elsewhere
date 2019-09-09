import {Atlas} from '../atlas/atlas'
import {Behavior} from './behavior'
import {Image} from '../images/image'
import {ImageRect} from '../images/image-rect'
import {Level} from '../levels/level'
import {Recorder} from '../inputs/recorder'
import {Rect} from '../math/rect'
import {UpdateType} from '../store/update-type'
import {XY} from '../math/xy'

/** Images and behavior. */
export interface Entity {
  readonly id: string
  state: string
  readonly updateType: UpdateType.Key
  readonly behavior: Behavior.Key
  readonly collisions: readonly Rect[]
  readonly scale: Mutable<XY>
  readonly vx: number
  readonly vy: number
  readonly states: Record<string, ImageRect>
}
type t = Entity

export namespace Entity {
  export const update = (
    val: t,
    entities: readonly t[],
    level: Level,
    atlas: Atlas,
    cam: Rect,
    time: number,
    recorder: Recorder
  ): readonly Image[] => {
    if (val.updateType === 'NEVER') return val.states[val.state].images
    Behavior[val.behavior](val, entities, level, atlas, cam, recorder, time)
    val.states[val.state].images.forEach(val => Image.animate(val, atlas, time))
    return val.states[val.state].images
  }

  export const velocity = (
    {vx, vy}: t,
    horizontal: boolean,
    vertical: boolean,
    time: number
  ): number =>
    ((horizontal && vertical
      ? vx // fix all this
      : horizontal
      ? Math.sqrt(vx * vx + vy * vy)
      : vertical
      ? Math.sqrt(vx * vx + vy * vy)
      : 0) *
      time) /
    10000
}
