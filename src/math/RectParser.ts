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
    return (config ?? []).map(parse)
  }

  export function parse(config: RectConfig): Rect {
    const position = XYParser.parse(config?.position)
    const size = WHParser.parse(config?.size)
    return {position, size}
  }
}
