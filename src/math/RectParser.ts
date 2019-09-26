import {Rect} from './Rect'
import {WHParser} from './WHParser'
import {XYParser} from './XYParser'
import {WH} from './WH'
import {XY} from './XY'

export type RectArrayConfig = Maybe<readonly RectConfig[]>
export type RectConfig = Maybe<
  Partial<{position?: Partial<XY>; size?: Partial<WH>}>
>

export namespace RectParser {
  export function parseAll(config: RectArrayConfig): Rect[] {
    return (config || []).map(parse)
  }

  export function parse(config: RectConfig): Rect {
    const position = config ? XYParser.parse(config.position) : {x: 0, y: 0}
    const size = config ? WHParser.parse(config.size) : {w: 0, h: 0}
    return {position, size}
  }
}
