import {WH} from './WH'
import {XY} from './XY'

/** Where XY describes the upper-left corner, or minimum, and XY + WH the
    bottom-right, or maximum. */
export interface Rect {
  readonly position: XY
  readonly size: WH
}

export namespace Rect {
  export function trunc(rect: Rect): Rect {
    return {position: rect.position.copy(), size: rect.size.copy()}
  }

  export function add(lhs: Rect, rhs: Rect): Rect {
    const position = lhs.position.add(rhs.position)
    const size = lhs.size.add(rhs.size)
    return {position, size}
  }

  export function moveAllBy(rects: readonly Rect[], by: Readonly<XY>): void {
    if (!by.x && !by.y) return
    for (const rect of rects) moveBy(rect, by)
  }

  export function moveBy(rect: Rect, by: Readonly<XY>): void {
    rect.position.x += by.x
    rect.position.y += by.y
  }

  // less-than-or-equal?
  /** @return True if lhs and rhs are overlapping, false if touching or
      independent. */
  export function intersects(lhs: Rect, rhs: Rect): boolean {
    return (
      lhs.position.x + lhs.size.w > rhs.position.x &&
      lhs.position.x < rhs.position.x + rhs.size.w &&
      lhs.position.y + lhs.size.h > rhs.position.y &&
      lhs.position.y < rhs.position.y + rhs.size.h
    )
  }

  export function within({position, size}: Rect, rhs: Rect): boolean {
    return (
      position.x >= rhs.position.x &&
      position.x + size.w <= rhs.position.x + rhs.size.w &&
      position.y >= rhs.position.y &&
      position.y + size.h <= rhs.position.y + rhs.size.h
    )
  }

  /** @return Width and / or height is less than zero if no intersection, equal
              to zero if touching but not overlapping, or greater than zero if
              overlapping. */
  export function intersection(lhs: Rect, rhs: Rect): Rect {
    // The bottom-rightmost coordinates is the upper-left of the intersection.
    const upperLeft = lhs.position.max(rhs.position)
    const w =
      Math.min(lhs.position.x + lhs.size.w, rhs.position.x + rhs.size.w) -
      upperLeft.x
    const h =
      Math.min(lhs.position.y + lhs.size.h, rhs.position.y + rhs.size.h) -
      upperLeft.y
    return {position: upperLeft, size: new WH(w, h)}
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
    const {x, y} = lhs.position.min(rhs.position)
    const w =
      Math.max(lhs.position.x + lhs.size.w, rhs.position.x + rhs.size.w) - x
    const h =
      Math.max(lhs.position.y + lhs.size.h, rhs.position.y + rhs.size.h) - y
    return {position: new XY(x, y), size: new WH(w, h)}
  }

  export function centerOn(rect: Rect, on: Rect): XY {
    const x =
      Math.trunc(on.position.x) +
      Math.trunc(on.size.w / 2) -
      Math.trunc(rect.size.w / 2)
    const y =
      Math.trunc(on.position.y) +
      Math.trunc(on.size.h / 2) -
      Math.trunc(rect.size.h / 2)
    return new XY(x, y)
  }
}
