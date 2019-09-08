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
export interface Entity
  extends Omit<Required<Entity.Config>, 'states' | 'x' | 'y' | 'period'> {
  readonly updateType: UpdateType.Key
  readonly behavior: Behavior.Key
  readonly scale: Mutable<XY>
  readonly states: Record<string, ImageRect>
}
type t = Entity

export namespace Entity {
  export interface Config extends Partial<XY> {
    readonly id?: string
    readonly state?: string
    readonly updateType?: UpdateType.Key | string
    readonly behavior?: Behavior.Key | string
    readonly collisions?: readonly Rect[]
    readonly scale?: Partial<XY>
    readonly vx?: number
    readonly vy?: number
    readonly ax?: number
    readonly ay?: number
    readonly states?: Readonly<Record<string, readonly Image.Config[]>>
    readonly period?: number
  }

  export const update = (
    state: Mutable<t>,
    entities: readonly t[],
    level: Level,
    atlas: Atlas,
    cam: Rect,
    time: number,
    recorder: Recorder
  ): readonly Image[] => {
    if (state.updateType === 'NEVER') return state.states[state.state].images
    ;(state.vx += state.ax * time), (state.vy += state.ay * time)
    Behavior[state.behavior](state, entities, level, atlas, cam, recorder)
    const rect = state.states[state.state]
    rect.images.forEach(img => Image.animate(img, atlas, time))
    return rect.images
  }
}
