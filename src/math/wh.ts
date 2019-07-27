export interface WH {
  readonly w: number
  readonly h: number
}
export namespace WH {
  export function add(lhs: WH, rhs: WH): WH {
    return {w: lhs.w + rhs.w, h: lhs.h + rhs.h}
  }
}
