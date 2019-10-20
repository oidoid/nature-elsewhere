import {XY} from './XY'
import {XYConfig} from './XYConfig'

export namespace XYParser {
  export function parse(config: XYConfig): XY {
    return new XY(config?.x ?? 0, config?.y ?? 0)
  }
}
