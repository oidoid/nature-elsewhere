import {Rect} from './Rect'
import {RectConfig, RectArrayConfig} from './RectConfig'
import {WHParser} from '../wh/WHParser'
import {XYParser} from '../xy/XYParser'

export namespace RectParser {
  export function parseAll(config: RectArrayConfig): Rect[] {
    return (config || []).map(parse)
  }

  export function parse(config: RectConfig): Rect {
    const position = config ? XYParser.parse(config.position) : {x: 0, y: 0}
    const size = config ? WHParser.parse(config.size) : {w: 0, h: 0}
    return {...position, ...size}
  }
}
