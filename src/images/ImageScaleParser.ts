import {XY} from '../math/xy/XY'

/** Defaults to (1, 1). */
export type ImageScaleConfig = Maybe<Partial<XY>>

export namespace ImageScaleParser {
  export function parse(config: ImageScaleConfig): XY {
    return {
      x: config && config.x !== undefined ? config.x : 1,
      y: config && config.y !== undefined ? config.y : 1
    }
  }
}
