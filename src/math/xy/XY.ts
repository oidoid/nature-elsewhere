import {NumberUtil} from '../number/NumberUtil'

export interface XY {
  readonly x: number
  readonly y: number
}

/** An integral XY. */
export type IntXY = XY
/** An integral XY in 1/10000 of a pixel. */
export type DecamillipixelIntXY = XY

export namespace XY {
  export function add({x, y}: XY, rhs: XY): XY {
    return {x: x + rhs.x, y: y + rhs.y}
  }

  export function sub({x, y}: XY, rhs: XY): XY {
    return {x: x - rhs.x, y: y - rhs.y}
  }

  export function mul({x, y}: XY, rhs: XY): XY {
    return {x: x * rhs.x, y: y * rhs.y}
  }

  export function div({x, y}: XY, rhs: XY): XY {
    return {x: x / rhs.x, y: y / rhs.y}
  }

  export function equal({x, y}: XY, rhs: XY): boolean {
    return x === rhs.x && y === rhs.y
  }

  export function min({x, y}: XY, rhs: XY): XY {
    return {x: Math.min(x, rhs.x), y: Math.min(y, rhs.y)}
  }

  export function max({x, y}: XY, rhs: XY): XY {
    return {x: Math.max(x, rhs.x), y: Math.max(y, rhs.y)}
  }

  export function trunc({x, y}: XY): XY {
    return {x: Math.trunc(x), y: Math.trunc(y)}
  }

  export function clamp(xy: XY, min: XY, max: XY): XY {
    const x = NumberUtil.clamp(xy.x, min.x, max.x)
    const y = NumberUtil.clamp(xy.y, min.y, max.y)
    return {x, y}
  }

  export function distance(lhs: XY, rhs: XY): number {
    const {x, y} = XY.sub(lhs, rhs)
    return Math.sqrt(x * x + y * y)
  }
}
