import {Build} from '../utils/Build'
import {Integer} from 'aseprite-atlas'
import {NumberUtil} from './NumberUtil'

/** Integral wrapper for nonnegative width and height (size / area). See XY. */
export class WH {
  static fromProps({w, h}: Readonly<{w: number; h: number}>) {
    return new WH(w, h)
  }

  static trunc(w: number, h: number): WH {
    return new WH(Math.trunc(w), Math.trunc(h))
  }

  static square(side: Integer): WH {
    return new WH(side, side)
  }

  private _w: Integer
  private _h: Integer

  constructor(w: Integer, h: Integer) {
    validate(w)
    validate(h)
    this._w = w
    this._h = h
  }

  get w(): Integer {
    return this._w
  }

  set w(w: Integer) {
    validate(w)
    this._w = w
  }

  get h(): Integer {
    return this._h
  }

  set h(h: Integer) {
    validate(h)
    this._h = h
  }

  copy(): WH {
    return new WH(this.w, this.h)
  }

  equal({w, h}: Readonly<WH>): boolean {
    return this.w === w && this.h === h
  }

  add(wh: Readonly<WH> | Integer): WH {
    const {w, h} = toWH(wh)
    return new WH(this.w + w, this.h + h)
  }

  sub(wh: Readonly<WH> | Integer): WH {
    const {w, h} = toWH(wh)
    return new WH(this.w - w, this.h - h)
  }

  mul(wh: Readonly<WH> | Integer): WH {
    const {w, h} = toWH(wh)
    return new WH(this.w * w, this.h * h)
  }

  div(wh: Readonly<WH> | Integer): WH {
    const {w, h} = toWH(wh)
    return new WH(this.w / w, this.h / h)
  }

  min(wh: Readonly<WH> | Integer): WH {
    const {w, h} = toWH(wh)
    return new WH(Math.min(this.w, w), Math.min(this.h, h))
  }

  max(wh: Readonly<WH> | Integer): WH {
    const {w, h} = toWH(wh)
    return new WH(Math.max(this.w, w), Math.max(this.h, h))
  }

  area(): Integer {
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

function toWH(val: Readonly<WH> | Integer): WH {
  if (typeof val === 'number') return WH.square(val)
  return val.copy()
}
