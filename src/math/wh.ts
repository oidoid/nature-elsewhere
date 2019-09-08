export interface WH {
  readonly w: number
  readonly h: number
}
export namespace WH {
  export const add = (lhs: WH, rhs: WH): WH => ({
    w: lhs.w + rhs.w,
    h: lhs.h + rhs.h
  })
}
