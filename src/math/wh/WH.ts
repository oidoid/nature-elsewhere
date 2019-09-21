export interface WH {
  readonly w: number
  readonly h: number
}

export namespace WH {
  export function trunc({w, h}: WH): WH {
    return {w: Math.trunc(w), h: Math.trunc(h)}
  }

  export function add({w, h}: WH, rhs: WH): WH {
    return {w: w + rhs.w, h: h + rhs.h}
  }

  export function equal(lhs: WH, rhs: WH): boolean {
    return lhs.w === rhs.w && lhs.h === rhs.h
  }
}
