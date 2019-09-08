export interface WH {
  readonly w: number
  readonly h: number
}
type t = WH

export namespace WH {
  export const add = (lhs: t, rhs: t): t => ({
    w: lhs.w + rhs.w,
    h: lhs.h + rhs.h
  })
}
