import {Rect} from './Rect'
import {RectConfig} from './RectConfig'
import {WHParser} from './WHParser'
import {XYParser} from './XYParser'

export namespace RectParser {
  export function parseAll(config: Maybe<readonly RectConfig[]>): Rect[] {
    return (config ?? []).map(parse)
  }

  export function parse(config: RectConfig): Rect {
    const position = XYParser.parse(config?.position)
    const size = WHParser.parse(config?.size)
    return {position, size}
  }
}
