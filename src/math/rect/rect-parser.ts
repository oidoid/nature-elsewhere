import {Rect} from './rect'
import {RectConfig} from './rect-config'
import {WHParser} from '../wh/wh-parser'
import {XYParser} from '../xy/xy-parser'

export namespace RectParser {
  export function parse(config: RectConfig): Rect {
    return {...XYParser.parse(config), ...WHParser.parse(config)}
  }
}
