import {Rect} from './rect'
import {XY} from './xy'

export type RectArray = {readonly rects: readonly Rect[]} & Rect

export namespace RectArray {
  export const intersects = (
    lhs: RectArray,
    rhs: RectArray
  ): Rect | undefined =>
    Rect.intersects(lhs, rhs)
      ? lhs.rects.find(val => intersectsRect(rhs, val))
      : undefined

  export const intersectsRect = (
    state: RectArray,
    rect: Rect
  ): Rect | undefined =>
    Rect.intersects(state, rect)
      ? state.rects.find(val => Rect.intersects(val, rect))
      : undefined

  export const moveTo = (val: RectArray, to: XY): RectArray =>
    moveBy(val, {x: to.x - val.x, y: to.y - val.y})

  export const moveBy = (val: RectArray, by: XY): RectArray =>
    by.x || by.y
      ? {
          ...Rect.moveBy(val, by),
          rects: val.rects.map(val => Rect.moveBy(val, by))
        }
      : val
}
