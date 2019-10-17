import {Build} from '../utils/Build'
import {FloatXY} from './FloatXY'
import {Integer} from 'aseprite-atlas'

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

  static diagonal(component: Integer): XY {
    return new XY(component, component)
  }

  private _x: Integer
  private _y: Integer

  constructor(x: Integer, y: Integer) {
    validate(x)
    validate(y)
    this._x = x
    this._y = y
  }

  get x(): Integer {
    return this._x
  }

  set x(x: Integer) {
    validate(x)
    this._x = x
  }

  get y(): Integer {
    return this._y
  }

  set y(y: Integer) {
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

  add(val: Readonly<FloatXY> | Integer): XY {
    return fromFloatXY(FloatXY.add(this, val))
  }

  sub(xy: Readonly<FloatXY> | Integer): XY {
    return fromFloatXY(FloatXY.sub(this, xy))
  }

  abs(): XY {
    return fromFloatXY(FloatXY.abs(this))
  }

  mul(xy: Readonly<FloatXY> | Integer): XY {
    return fromFloatXY(FloatXY.mul(this, xy))
  }

  div(xy: Readonly<FloatXY> | Integer): XY {
    return fromFloatXY(FloatXY.div(this, xy))
  }

  min(xy: Readonly<FloatXY> | Integer): XY {
    return fromFloatXY(FloatXY.min(this, xy))
  }

  max(xy: Readonly<FloatXY> | Integer): XY {
    return fromFloatXY(FloatXY.max(this, xy))
  }

  magnitude(): Integer {
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
