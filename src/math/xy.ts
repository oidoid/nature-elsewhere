declare global {
  interface XY {
    readonly x: number
    readonly y: number
  }
}

export function add(lhs: XY, rhs: XY): XY {
  return {x: lhs.x + rhs.x, y: lhs.y + rhs.y}
}

export function max(lhs: XY, rhs: XY): XY {
  return {x: Math.max(lhs.x, rhs.x), y: Math.max(lhs.y, rhs.y)}
}
