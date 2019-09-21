import {DecamillipixelIntXYConfig} from './DecamillipixelIntXYConfig'
import {XY} from '../../math/xy/XY'
import {IntParser} from '../../math/intParser/IntParser'

export namespace DecamillipixelIntXYParser {
  export function parse(config: DecamillipixelIntXYConfig): XY {
    return {
      x: config && config.x !== undefined ? IntParser.parse(config.x) : 0,
      y: config && config.y !== undefined ? IntParser.parse(config.y) : 0
    }
  }
}
