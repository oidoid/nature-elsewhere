import {WH} from '../wh/wh'
import {XY} from '../xy/xy'

/** Where XY describes the upper-left corner, or minimum, and XY + WH the
    bottom-right, or maximum. */
export interface Rect extends XY, WH {}

export namespace Rect {
  export function trunc(rect: Rect): Rect {
    const {x, y} = XY.trunc(rect)
    const {w, h} = WH.trunc(rect)
    return {x, y, w, h}
  }

  export function add(lhs: Rect, rhs: Rect): Rect {
    const {x, y} = XY.add(lhs, rhs)
    const {w, h} = WH.add(lhs, rhs)
    return {x, y, w, h}
  }

  export function moveAllBy(rects: readonly Writable<Rect>[], by: XY): void {
    if (!by.x && !by.y) return
    for (const rect of rects) moveBy(rect, by)
  }

  export function moveBy(rect: Writable<Rect>, by: XY): void {
    rect.x += by.x
    rect.y += by.y
  }

  // less-than-or-equal?
  /** @return True if lhs and rhs are overlapping, false if touching or
      independent. */
  export function intersects(lhs: Rect, rhs: Rect): boolean {
    return (
      lhs.x + lhs.w > rhs.x &&
      lhs.x < rhs.x + rhs.w &&
      lhs.y + lhs.h > rhs.y &&
      lhs.y < rhs.y + rhs.h
    )
  }

  export function within({x, y, w, h}: Rect, rhs: Rect): boolean {
    return (
      x >= rhs.x &&
      x + w <= rhs.x + rhs.w &&
      y >= rhs.y &&
      y + h <= rhs.y + rhs.h
    )
  }

  /** @return Width and / or height is less than zero if no intersection, equal
              to zero if touching but not overlapping, or greater than zero if
              overlapping. */
  export function intersection(lhs: Rect, rhs: Rect): Rect {
    // The bottom-rightmost coordinates is the upper-left of the intersection.
    const upperLeft = XY.max(lhs, rhs)
    const w = Math.min(lhs.x + lhs.w, rhs.x + rhs.w) - upperLeft.x
    const h = Math.min(lhs.y + lhs.h, rhs.y + rhs.h) - upperLeft.y
    return {x: upperLeft.x, y: upperLeft.y, w, h}
  }

  export function unionAll(rects: readonly Rect[]): Maybe<Rect> {
    // Make a copy of the first element, rects[0], in case it's modified. When
    // rects has a length of one, union is not called and rects[0] would be
    // returned directly. This behavior differs from all other nonzero cases in
    // that no element of the array is ever returned (union() returns a new Rect
    // instance). If that first element is modified by the caller, it changes
    // the unionAll() result implicitly which is probably unexpected.
    return rects.length ? rects.reduce(union, {...rects[0]}) : undefined
  }

  export function union(lhs: Rect, rhs: Rect): Rect {
    const {x, y} = XY.min(lhs, rhs)
    const w = Math.max(lhs.x + lhs.w, rhs.x + rhs.w) - x
    const h = Math.max(lhs.y + lhs.h, rhs.y + rhs.h) - y
    return {x, y, w, h}
  }
}
