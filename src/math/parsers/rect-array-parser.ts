import {Rect} from '../rect'
import {RectArrayConfig} from './rect-array-config'
import {RectParser} from './rect-parser'

export namespace RectArrayParser {
  export function parse(config: RectArrayConfig): Rect[] {
    return (config || []).map(RectParser.parse)
  }
}
