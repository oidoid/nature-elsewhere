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
  constructor(private _x: number, private _y: number) {}

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

  add({x, y}: Readonly<XY>): XY {
    return new XY(this.x + x, this.y + y)
  }

  sub({x, y}: Readonly<XY>): XY {
    return new XY(this.x - x, this.y - y)
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

  clamp(min: Readonly<XY>, max: Readonly<XY>): XY {
    const x = NumberUtil.clamp(this.x, min.x, max.x)
    const y = NumberUtil.clamp(this.y, min.y, max.y)
    return new XY(x, y)
  }

  magnitude(xy: Readonly<XY>): number {
    const {x, y} = this.sub(xy)
    return Math.sqrt(x * x + y * y)
  }
}
