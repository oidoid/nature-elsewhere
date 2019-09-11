import {Atlas} from '../atlas/atlas'
import {Behavior} from './behavior'
import {Image} from '../images/image'
import {ImageRect} from '../images/image-rect'
import {Level} from '../levels/level'
import {Recorder} from '../inputs/recorder'
import {Rect} from '../math/rect'
import {UpdateType} from '../store/update-type'
import {XY} from '../math/xy'
import {EntityRect} from './entity-rect'

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
    entities: readonly (t | EntityRect)[],
    level: Level,
    atlas: Atlas,
    cam: Rect,
    time: number,
    recorder: Recorder
  ): void => {
    if (val.updateType === 'NEVER') return
    Behavior[val.behavior](val, entities, level, atlas, cam, recorder, time)
  }

  export const layout = (
    val: t,
    atlas: Atlas,
    time: number
  ): readonly Image[] => {
    animate(val, atlas, time)
    return val.states[val.state].images
  }

  export const moveBy = (val: t, by: XY): void => {
    val.states[val.state] = ImageRect.moveBy(val.states[val.state], by)
  }

  export const velocity = (
    {vx, vy}: t,
    horizontal: boolean,
    vertical: boolean,
    time: number
  ): XY => {
    const x = horizontal
      ? vertical
        ? vx
        : Math.sign(vx) * Math.sqrt(vx * vx + vy * vy)
      : 0
    const y = vertical
      ? horizontal
        ? vy
        : Math.sign(vy) * Math.sqrt(vx * vx + vy * vy)
      : 0
    return {x: (x * time) / 10000, y: (y * time) / 10000}
  }
}

const animate = (val: t, atlas: Atlas, time: number): void =>
  val.states[val.state].images.forEach(val => Image.animate(val, atlas, time))
