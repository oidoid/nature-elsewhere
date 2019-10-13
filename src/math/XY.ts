import {Build} from '../utils/Build'
import {FloatXY} from './FloatXY'

/** Integral XY in 1/10000 of a pixel. */
export type DecamillipixelXY = XY

/** Integral wrapper of x and y-axis components. This class exists to make
    rounding errors easier to debug by encapsulating mutation in setters with
    integer state checks. */
export class XY {
  static trunc(xy: Readonly<FloatXY>): XY
  static trunc(x: number, y: number): XY
  static trunc(val: number | Readonly<FloatXY>, y?: number): XY {
    if (typeof val === 'number') {
      if (typeof y !== 'number') throw new Error('Invalid y.')
      return new XY(Math.trunc(val), Math.trunc(y))
    }
    return new XY(Math.trunc(val.x), Math.trunc(val.y))
  }

  static diagonal(component: number): XY {
    return new XY(component, component)
  }

  private _x: number
  private _y: number

  constructor(x: number, y: number) {
    validate(x)
    validate(y)
    this._x = x
    this._y = y
  }

  get x(): number {
    return this._x
  }

  set x(x: number) {
    validate(x)
    this._x = x
  }

  get y(): number {
    return this._y
  }

  set y(y: number) {
    validate(y)
    this._y = y
  }

  copy(): XY {
    return fromFloatXY(FloatXY.copy(this))
  }

  equal(xy: Readonly<FloatXY>): boolean {
    return FloatXY.equal(this, xy)
  }

  toFloatXY(): FloatXY {
    return {x: this.x, y: this.y}
  }

  add(val: Readonly<FloatXY> | number): XY {
    return fromFloatXY(FloatXY.add(this, val))
  }

  sub(xy: Readonly<FloatXY>): XY {
    return fromFloatXY(FloatXY.sub(this, xy))
  }

  abs(): XY {
    return fromFloatXY(FloatXY.abs(this))
  }

  mul(xy: Readonly<FloatXY>): XY {
    return fromFloatXY(FloatXY.mul(this, xy))
  }

  div(xy: Readonly<FloatXY>): XY {
    return fromFloatXY(FloatXY.div(this, xy))
  }

  min(xy: Readonly<FloatXY>): XY {
    return fromFloatXY(FloatXY.min(this, xy))
  }

  max(xy: Readonly<FloatXY>): XY {
    return fromFloatXY(FloatXY.max(this, xy))
  }

  magnitude(): number {
    return FloatXY.magnitude(this)
  }

  clamp(min: Readonly<FloatXY>, max: Readonly<FloatXY>): XY {
    return fromFloatXY(FloatXY.clamp(this, min, max))
  }
}

function validate(component: number): void {
  if (Build.dev && !Number.isInteger(component))
    throw new Error(`${component} fractional component forbidden.`)
}

/** Assumes integral FloatXY. */
function fromFloatXY({x, y}: Readonly<FloatXY>): XY {
  return new XY(x, y)
}
