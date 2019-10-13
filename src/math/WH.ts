import {Build} from '../utils/Build'
import {NumberUtil} from './NumberUtil'

/** Integral wrapper for nonnegative width and height (size / area). See XY. */
export class WH {
  static trunc(w: number, h: number): WH {
    return new WH(Math.trunc(w), Math.trunc(h))
  }

  static square(side: number): WH {
    return new WH(side, side)
  }

  private _w: number
  private _h: number

  constructor(w: number, h: number) {
    validate(w)
    validate(h)
    this._w = w
    this._h = h
  }

  get w(): number {
    return this._w
  }

  set w(w: number) {
    validate(w)
    this._w = w
  }

  get h(): number {
    return this._h
  }

  set h(h: number) {
    validate(h)
    this._h = h
  }

  copy(): WH {
    return new WH(this.w, this.h)
  }

  equal({w, h}: Readonly<WH>): boolean {
    return this.w === w && this.h === h
  }

  add(wh: Readonly<WH> | number): WH {
    const {w, h} = toWH(wh)
    return new WH(this.w + w, this.h + h)
  }

  sub(wh: Readonly<WH> | number): WH {
    const {w, h} = toWH(wh)
    return new WH(this.w - w, this.h - h)
  }

  mul(wh: Readonly<WH> | number): WH {
    const {w, h} = toWH(wh)
    return new WH(this.w * w, this.h * h)
  }

  div(wh: Readonly<WH> | number): WH {
    const {w, h} = toWH(wh)
    return new WH(this.w / w, this.h / h)
  }

  min(wh: Readonly<WH> | number): WH {
    const {w, h} = toWH(wh)
    return new WH(Math.min(this.w, w), Math.min(this.h, h))
  }

  max(wh: Readonly<WH> | number): WH {
    const {w, h} = toWH(wh)
    return new WH(Math.max(this.w, w), Math.max(this.h, h))
  }

  area(): number {
    return this.w * this.h
  }

  clamp(min: Readonly<WH>, max: Readonly<WH>): WH {
    const w = NumberUtil.clamp(this.w, min.w, max.w)
    const h = NumberUtil.clamp(this.h, min.h, max.h)
    return new WH(w, h)
  }
}

function validate(side: number): void {
  if (Build.dev && !Number.isInteger(side))
    throw new Error(`${side} fractional dimension forbidden.`)
}

function toWH(val: Readonly<WH> | number): WH {
  if (typeof val === 'number') return WH.square(val)
  return val.copy()
}
