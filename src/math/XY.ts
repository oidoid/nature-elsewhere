import {NumberUtil} from './NumberUtil'
import {Build} from '../utils/Build'

export interface FloatXY {
  x: number
  y: number
}

/** Integral XY in 1/10000 of a pixel. */
export type DecamillipixelIntXY = XY
export type DecamillipixelXY = XY

/** Integral wrapper of x and y-axis components. This class exists to make
    rounding errors easier to debug by encapsulating mutation in setters with
    integer state checks. */
export class XY {
  static trunc(x: number, y: number): XY {
    return new XY(Math.trunc(x), Math.trunc(y))
  }

  private _x: number
  private _y: number

  constructor(x: number, y: number) {
    this._x = x
    this._y = y
  }

  get x(): number {
    return this._x
  }

  set x(x: number) {
    if (Build.dev && !Number.isInteger(x))
      throw new Error(`${x} fractional x is forbidden.`)
    this._x = x
  }

  get y(): number {
    return this._y
  }

  set y(y: number) {
    if (Build.dev && !Number.isInteger(y))
      throw new Error(`${y} fractional y is forbidden.`)
    this._y = y
  }

  copy(): XY {
    return new XY(this.x, this.y)
  }

  add(val: Readonly<XY> | number): XY {
    val = toXY(val)
    return new XY(this.x + val.x, this.y + val.y)
  }

  sub({x, y}: Readonly<XY>): XY {
    return new XY(this.x - x, this.y - y)
  }

  abs(): XY {
    return new XY(Math.abs(this.x), Math.abs(this.y))
  }

  mul({x, y}: Readonly<XY>): XY {
    return new XY(this.x * x, this.y * y)
  }

  div({x, y}: Readonly<XY>): XY {
    return new XY(this.x / x, this.y / y)
  }

  equal({x, y}: Readonly<XY>): boolean {
    return this.x === x && this.y === y
  }

  min({x, y}: Readonly<XY>): XY {
    return new XY(Math.min(this.x, x), Math.min(this.y, y))
  }

  max({x, y}: Readonly<XY>): XY {
    return new XY(Math.max(this.x, x), Math.max(this.y, y))
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
}

export namespace FloatXY {
  export function lerp(
    from: Readonly<XY | FloatXY>,
    to: Readonly<XY | FloatXY>,
    ratio: number
  ): FloatXY {
    const x = from.x * (1 - ratio) + to.x * ratio
    const y = from.y * (1 - ratio) + to.y * ratio
    return {x, y}
  }

  export function clamp(
    val: Readonly<XY | FloatXY>,
    min: Readonly<XY>,
    max: Readonly<XY>
  ): FloatXY {
    const x = NumberUtil.clamp(val.x, min.x, max.x)
    const y = NumberUtil.clamp(val.y, min.y, max.y)
    return {x, y}
  }
}

function toXY(val: Readonly<XY> | number): Readonly<XY> {
  return typeof val === 'number' ? new XY(val, val) : val
}
