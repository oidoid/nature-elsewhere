export interface WH {
  w: number
  h: number
}

export namespace WH {
  export function trunc({w, h}: Readonly<WH>): WH {
    return {w: Math.trunc(w), h: Math.trunc(h)}
  }

  export function add({w, h}: Readonly<WH>, rhs: Readonly<WH>): WH {
    return {w: w + rhs.w, h: h + rhs.h}
  }

  export function equal(lhs: Readonly<WH>, rhs: Readonly<WH>): boolean {
    return lhs.w === rhs.w && lhs.h === rhs.h
  }
}
