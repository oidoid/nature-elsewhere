import {Input} from '../input'
import {InputBit} from '../input-bit'
import {InputSource} from '../input-source'
import {XY} from '../../math/xy'

export namespace MouseInput {
  export interface Pick extends Input {
    readonly source: InputSource.MOUSE_PICK

    readonly bits: InputBit.PICK | 0

    /** The fractional position of the input in level coordinates. */
    readonly xy: XY
  }

  export interface Point extends Input {
    readonly source: InputSource.MOUSE_POINT

    readonly bits: InputBit.POINT | 0

    /** The fractional position of the input in level coordinates. */
    readonly xy: XY
  }
}
