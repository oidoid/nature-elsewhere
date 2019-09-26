import {XY} from './XY'
import {IntParser} from './IntParser'

export type DecamillipixelIntXYConfig = Maybe<Partial<XY>>

export namespace DecamillipixelIntXYParser {
  export function parse(config: DecamillipixelIntXYConfig): XY {
    return {
      x: config && config.x !== undefined ? IntParser.parse(config.x) : 0,
      y: config && config.y !== undefined ? IntParser.parse(config.y) : 0
    }
  }
}
