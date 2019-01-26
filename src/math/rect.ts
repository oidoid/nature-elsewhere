import * as xy from './xy'

declare global {
  /**
   * Where XY describes the upper-left corner, or minimum, and XY + WH the
   * bottom-right, or maximum.
   */
  type Rect = XY & WH
}

/**
 * @return {boolean} True if lhs and rhs are touching or overlapping, false if
 *                   independent.
 */
export function intersects(lhs: Rect, rhs: Rect) {
  const overlap = intersection(lhs, rhs)
  return overlap.w >= 0 && overlap.h >= 0
}

/**
 * @return {Rect} Width and / or height is less than zero if no intersection,
 *                equal to zero if touching but not overlapping, or greater than
 *                zero if overlapping.
 */
export function intersection(lhs: Rect, rhs: Rect) {
  // The bottom-rightmost coordinates.
  const upperLeft = xy.max(lhs, rhs)
  return {
    x: upperLeft.x,
    y: upperLeft.y,
    w: Math.min(lhs.x + lhs.w, rhs.x + rhs.w) - upperLeft.x,
    h: Math.min(lhs.y + lhs.h, rhs.y + rhs.h) - upperLeft.y
  }
}
