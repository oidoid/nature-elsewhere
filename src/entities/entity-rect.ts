import {Atlas} from '../atlas/atlas'
import {Entity} from './entity'
import {EntityRectBehavior} from './entity-rect-behavior'
import {Image} from '../images/image'
import {Level} from '../levels/level'
import {Recorder} from '../inputs/recorder'
import {RectArray} from '../math/rect-array'
import {Rect} from '../math/rect'
import {XY} from '../math/xy'

/** The upper-left of the rectangle describing the union of images in level
    coordinates. */
export interface EntityRect extends Mutable<Rect> {
  readonly behavior: EntityRectBehavior.Key
  /** Image coordinates are not relative origin. */
  readonly entities: readonly (Entity | EntityRect)[] // rename children
}
type t = EntityRect

export namespace EntityRect {
  export const find = (
    val: readonly (Entity | EntityRect)[],
    id: string
  ): Maybe<Entity> => {
    for (const i of val) {
      const ret = is(i) ? find(i.entities, id) : i.id === id ? i : undefined
      if (ret) return ret
    }
    return undefined
  }

  export const update = (
    val: t,
    atlas: Atlas,
    cam: Rect,
    level: Level,
    milliseconds: number,
    recorder: Recorder
  ): Image[] => {
    if (!Rect.intersects(val, cam)) return []
    const entities = val.entities.filter(
      val =>
        (!('entities' in val) && val.updateType === 'ALWAYS') ||
        ('entities' in val
          ? Rect.intersects(val, cam)
          : Rect.intersects(val.states[val.state], cam))
    )
    return filterUpdate(
      entities,
      entities,
      atlas,
      cam,
      level,
      milliseconds,
      recorder
    )
  }

  export const invalidate = (val: t): void => {
    const union = RectArray.union(
      val.entities.map(val => ('entities' in val ? val : val.states[val.state]))
    )
    if (union) ({w: val.w, h: val.h} = union)
  }

  export const moveTo = (val: t, to: XY): t =>
    moveBy(val, {x: to.x - val.x, y: to.y - val.y})

  export const moveBy = (val: t, by: XY): t => {
    if (!by.x && !by.y) return val
    val.entities.forEach(val =>
      'entities' in val ? moveBy(val, by) : Entity.moveBy(val, by)
    )
    return {
      ...Rect.moveBy(val, {x: by.x, y: by.y}),
      behavior: val.behavior,
      entities: val.entities
    }
  }

  export const is = (val: Entity | EntityRect): val is EntityRect =>
    'entities' in val

  export function filterUpdate(
    val: readonly (Entity | EntityRect)[],
    entities: (Entity | EntityRect)[],
    atlas: Atlas,
    cam: Rect,
    level: Level,
    milliseconds: number,
    recorder: Recorder
  ): Image[] {
    return val
      .map(val =>
        is(val)
          ? EntityRectBehavior[val.behavior](
              val,
              entities,
              atlas,
              cam,
              level,
              milliseconds,
              recorder
            )
          : Entity.update(
              val,
              entities,
              level,
              atlas,
              cam,
              milliseconds,
              recorder
            )
      )
      .reduce((ret: Image[], val) => [...ret, ...val], [])
  }
}
