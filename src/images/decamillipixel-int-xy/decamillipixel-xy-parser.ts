import {DecamillipixelIntXYConfig} from './decamillipixel-int-xy-config'
import {XY} from '../../math/xy/xy'
import {IntParser} from '../../math/int-parser/int-parser'

export namespace DecamillipixelIntXYParser {
  export function parse(config: DecamillipixelIntXYConfig): XY {
    return {
      x: config && config.x !== undefined ? IntParser.parse(config.x) : 0,
      y: config && config.y !== undefined ? IntParser.parse(config.y) : 0
    }
  }
}
