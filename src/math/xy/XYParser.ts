import {XY} from './XY'
import {XYConfig} from './XYConfig'

export namespace XYParser {
  export function parse(config: XYConfig): XY {
    const x = config && config.x !== undefined ? config.x : 0
    const y = config && config.y !== undefined ? config.y : 0
    return {x, y}
  }
}
