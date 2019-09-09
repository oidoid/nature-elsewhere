export type XY = Readonly<{x: number; y: number}>
type t = XY

export namespace XY {
  export const add = ({x, y}: t, rhs: t): t => ({x: x + rhs.x, y: y + rhs.y})

  export const sub = ({x, y}: t, rhs: t): t => ({x: x - rhs.x, y: y - rhs.y})

  export const equal = ({x, y}: t, rhs: t): boolean =>
    x === rhs.x && y === rhs.y

  export const min = ({x, y}: t, rhs: t): t => ({
    x: Math.min(x, rhs.x),
    y: Math.min(y, rhs.y)
  })

  export const max = ({x, y}: t, rhs: t): t => ({
    x: Math.max(x, rhs.x),
    y: Math.max(y, rhs.y)
  })

  export const trunc = ({x, y}: t): t => ({x: Math.trunc(x), y: Math.trunc(y)})
}
