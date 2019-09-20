import {Rect} from './rect'
import {RectConfig, RectArrayConfig} from './rect-config'
import {WHParser} from '../wh/wh-parser'
import {XYParser} from '../xy/xy-parser'

export namespace RectParser {
  export function parseAll(config: RectArrayConfig): Rect[] {
    return (config || []).map(parse)
  }

  export function parse(config: RectConfig): Rect {
    const {x, y} = XYParser.parse(config)
    const {w, h} = WHParser.parse(config)
    return {x, y, w, h}
  }
}
