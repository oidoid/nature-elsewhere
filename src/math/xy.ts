export type XY = Readonly<{x: number; y: number}>
type t = XY

export namespace XY {
  export const add = (lhs: t, rhs: t): t => ({
    x: lhs.x + rhs.x,
    y: lhs.y + rhs.y
  })

  export const sub = (lhs: t, rhs: t): t => ({
    x: lhs.x - rhs.x,
    y: lhs.y - rhs.y
  })

  export const min = (lhs: t, rhs: t): t => ({
    x: Math.min(lhs.x, rhs.x),
    y: Math.min(lhs.y, rhs.y)
  })

  export const max = (lhs: t, rhs: t): t => ({
    x: Math.max(lhs.x, rhs.x),
    y: Math.max(lhs.y, rhs.y)
  })

  export const trunc = ({x, y}: t): t => ({
    x: Math.trunc(x),
    y: Math.trunc(y)
  })
}
