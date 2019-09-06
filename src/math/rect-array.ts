import {Rect} from './rect'
import {XY} from './xy'

type t = readonly Rect[]

export namespace RectArray {
  export const intersects = (lhs: t, rhs: t | Rect): $<Rect> =>
    lhs.find(val =>
      'length' in rhs ? intersects(rhs, val) : Rect.intersects(val, rhs)
    )

  export const moveBy = (val: t, by: XY): t =>
    by.x || by.y ? val.map(val => Rect.moveBy(val, by)) : val
}
