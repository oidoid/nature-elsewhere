import {Rect} from './Rect'
import {RectConfig, RectArrayConfig} from './RectConfig'
import {WHParser} from '../wh/WHParser'
import {XYParser} from '../xy/XYParser'

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
