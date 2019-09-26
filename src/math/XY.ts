import {NumberUtil} from './NumberUtil'

export interface XY {
  x: number
  y: number
}

/** An integral XY. */
export type IntXY = XY
/** An integral XY in 1/10000 of a pixel. */
export type DecamillipixelIntXY = XY
export type DecamillipixelXY = XY

export namespace XY {
  export function add({x, y}: Readonly<XY>, rhs: Readonly<XY>): XY {
    return {x: x + rhs.x, y: y + rhs.y}
  }

  export function sub({x, y}: Readonly<XY>, rhs: Readonly<XY>): XY {
    return {x: x - rhs.x, y: y - rhs.y}
  }

  export function mul({x, y}: Readonly<XY>, rhs: Readonly<XY>): XY {
    return {x: x * rhs.x, y: y * rhs.y}
  }

  export function div({x, y}: Readonly<XY>, rhs: Readonly<XY>): XY {
    return {x: x / rhs.x, y: y / rhs.y}
  }

  export function equal({x, y}: Readonly<XY>, rhs: Readonly<XY>): boolean {
    return x === rhs.x && y === rhs.y
  }

  export function min({x, y}: Readonly<XY>, rhs: Readonly<XY>): XY {
    return {x: Math.min(x, rhs.x), y: Math.min(y, rhs.y)}
  }

  export function max({x, y}: Readonly<XY>, rhs: Readonly<XY>): XY {
    return {x: Math.max(x, rhs.x), y: Math.max(y, rhs.y)}
  }

  export function trunc({x, y}: Readonly<XY>): XY {
    return {x: Math.trunc(x), y: Math.trunc(y)}
  }

  export function clamp(
    xy: Readonly<XY>,
    min: Readonly<XY>,
    max: Readonly<XY>
  ): XY {
    const x = NumberUtil.clamp(xy.x, min.x, max.x)
    const y = NumberUtil.clamp(xy.y, min.y, max.y)
    return {x, y}
  }

  export function magnitude(lhs: Readonly<XY>, rhs: Readonly<XY>): number {
    const {x, y} = XY.sub(lhs, rhs)
    return Math.sqrt(x * x + y * y)
  }
}
