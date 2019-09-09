export type WH = Readonly<{w: number; h: number}>
type t = WH

export namespace WH {
  export const add = ({w, h}: t, rhs: t): t => ({w: w + rhs.w, h: h + rhs.h})
}
