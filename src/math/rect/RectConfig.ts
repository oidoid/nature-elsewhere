import {WH} from '../wh/WH'
import {XY} from '../xy/XY'

export type RectConfig = Maybe<
  Partial<{position?: Partial<XY>; size?: Partial<WH>}>
>
export type RectArrayConfig = Maybe<readonly RectConfig[]>
