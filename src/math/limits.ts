import * as object from '../utils/object'

export const MIN: number = -0x8000
export const HALF_MIN: number = -0x4000
export const HALF_MAX: number = 0x4000
export const MAX: number = 0x7fff

export const HALF_MAX_XY: XY = object.freeze({x: HALF_MAX, y: HALF_MAX})
export const MAX_XY: XY = object.freeze({x: MAX, y: MAX})
