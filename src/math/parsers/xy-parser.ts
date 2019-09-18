import {XY} from '../xy'
import {XYConfig} from './xy-config'

export namespace XYParser {
  export function parse(config: XYConfig): XY {
    return {
      x: config && config.x !== undefined ? config.x : 0,
      y: config && config.y !== undefined ? config.y : 0
    }
  }
}
