import {Rect} from './rect'
import {XY} from './xy'

export namespace RectArray {
  export function union(rects: readonly Rect[]): Maybe<Rect> {
    return rects.length ? {...rects.reduce(Rect.union)} : undefined
  }

  export function intersects(
    lhs: readonly Rect[],
    rhs: readonly Rect[] | Rect
  ): Maybe<Rect> {
    return lhs.find(rect =>
      'length' in rhs ? intersects(rhs, rect) : Rect.intersects(rect, rhs)
    )
  }

  export function moveBy(rects: readonly Writable<Rect>[], by: XY): void {
    if (!by.x && !by.y) return
    rects.forEach(rect => Rect.moveBy(rect, by))
  }
}
