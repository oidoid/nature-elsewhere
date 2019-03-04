import {XY} from './xy'
import {WH} from './wh'

declare global {
  /**
   * Where XY describes the upper-left corner, or minimum, and XY + WH the
   * bottom-right, or maximum.
   */
  type Rect = XY & WH
}

export namespace Rect {
  export function add(lhs: Rect, rhs: Rect): Rect {
    return {...XY.add(lhs, rhs), ...WH.add(lhs, rhs)}
  }

  /**
   * @return True if lhs and rhs are touching or overlapping, false if
   *         independent.
   */
  export function intersects(lhs: Rect, rhs: Rect): boolean {
    const overlap = intersection(lhs, rhs)
    return overlap.w >= 0 && overlap.h >= 0
  }

  /**
   * @return Width and / or height is less than zero if no intersection, equal to
   *         zero if touching but not overlapping, or greater than zero if
   *         overlapping.
   */
  export function intersection(lhs: Rect, rhs: Rect): Rect {
    // The bottom-rightmost coordinates.
    const upperLeft = XY.max(lhs, rhs)
    return {
      x: upperLeft.x,
      y: upperLeft.y,
      w: Math.min(lhs.x + lhs.w, rhs.x + rhs.w) - upperLeft.x,
      h: Math.min(lhs.y + lhs.h, rhs.y + rhs.h) - upperLeft.y
    }
  }

  export function union(lhs: Rect, rhs: Rect): Rect {
    const min = XY.min(lhs, rhs)
    return {
      ...min,
      w: Math.max(lhs.x + lhs.w, rhs.x + rhs.w) - min.x,
      h: Math.max(lhs.y + lhs.h, rhs.y + rhs.h) - min.y
    }
  }
}
