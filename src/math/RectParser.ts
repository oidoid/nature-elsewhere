import {Rect} from './Rect'
import {WHParser} from './WHParser'
import {XYParser} from './XYParser'
import {WH} from './WH'
import {XY} from './XY'

export type RectArrayConfig = Maybe<readonly RectConfig[]>
export type RectConfig = Maybe<
  Partial<Readonly<{position?: Partial<XY>; size?: Partial<WH>}>>
>

export namespace RectParser {
  export function parseAll(config: RectArrayConfig): Rect[] {
    return (config || []).map(parse)
  }

  export function parse(config: RectConfig): Rect {
    const position = config ? XYParser.parse(config.position) : new XY(0, 0)
    const size = config ? WHParser.parse(config.size) : new WH(0, 0)
    return {position, size}
  }
}
