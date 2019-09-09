import {Rect} from './rect'
import {XY} from './xy'

type t = readonly Rect[]

export namespace RectArray {
  export const union = (val: t): Maybe<Rect> =>
    val.length ? val.reduce(Rect.union) : undefined

  export const intersects = (lhs: t, rhs: t | Rect): Maybe<Rect> =>
    lhs.find(val =>
      'length' in rhs ? intersects(rhs, val) : Rect.intersects(val, rhs)
    )

  export const moveBy = (val: t, by: XY): t =>
    by.x || by.y ? val.map(val => Rect.moveBy(val, by)) : val
}
