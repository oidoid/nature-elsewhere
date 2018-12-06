/**
 * @arg {Rect} lhs
 * @arg {Rect} rhs
 * @return {boolean} True if lhs and rhs are touching or overlapping, false if
 *                   independent.
 */
export function intersects(lhs, rhs) {
  const overlap = intersection(lhs, rhs)
  return overlap.w >= 0 && overlap.h >= 0
}

/**
 * @arg {Rect} lhs
 * @arg {Rect} rhs
 * @return {Rect} Width and / or height is less than zero if no intersection,
 *                equal to zero if touching but not overlapping, or greater than
 *                zero if overlapping.
 */
export function intersection(lhs, rhs) {
  const upperLeft = maximumXY(lhs, rhs)
  return {
    x: upperLeft.x,
    y: upperLeft.y,
    w: Math.min(lhs.x + lhs.w, rhs.x + rhs.w) - upperLeft.x,
    h: Math.min(lhs.y + lhs.h, rhs.y + rhs.h) - upperLeft.y
  }
}

/**
 * @arg {XY} lhs
 * @arg {XY} rhs
 * @return {XY} The bottom-rightmost coordinates.
 */
export function maximumXY(lhs, rhs) {
  return {x: Math.max(lhs.x, rhs.x), y: Math.max(lhs.y, rhs.y)}
}
