import {WH} from './wh'
import {XY} from './xy'

/** Where XY describes the upper-left corner, or minimum, and XY + WH the
    bottom-right, or maximum. */
export interface Rect extends XY, WH {}

export namespace Rect {
  export function trunc(rect: Rect): Rect {
    return {...XY.trunc(rect), ...WH.trunc(rect)}
  }

  export function add(lhs: Rect, rhs: Rect): Rect {
    return {...XY.add(lhs, rhs), ...WH.add(lhs, rhs)}
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

  /** The union or bounds of an array of Rects may be computed thus:
      `{...rects.reduce(Rect.union)}`. */
  export function union(lhs: Rect, rhs: Rect): Rect {
    const {x, y} = XY.min(lhs, rhs)
    const w = Math.max(lhs.x + lhs.w, rhs.x + rhs.w) - x
    const h = Math.max(lhs.y + lhs.h, rhs.y + rhs.h) - y
    return {x, y, w, h}
  }
}
