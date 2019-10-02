import {Build} from '../utils/Build'

/** Integral wrapper for width and height (size / area). See XY. */
export class WH {
  private _w: number
  private _h: number

  constructor(w: number, h: number) {
    this._w = w
    this._h = h
  }

  get w(): number {
    return this._w
  }

  set w(w: number) {
    if (Build.dev && !Number.isInteger(w))
      throw new Error(`${w} fractional w is forbidden.`)
    this._w = w
  }

  get h(): number {
    return this._h
  }

  set h(h: number) {
    if (Build.dev && !Number.isInteger(h))
      throw new Error(`${h} fractional h is forbidden.`)
    this._h = h
  }

  copy(): WH {
    return new WH(this.w, this.h)
  }

  add({w, h}: Readonly<WH>): WH {
    return new WH(this.w + w, this.h + h)
  }

  equal({w, h}: Readonly<WH>): boolean {
    return this.w === w && this.h === h
  }
}
