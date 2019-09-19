import {Input} from '../input'
import {InputBit} from '../input-bit/input-bit'
import {InputSource} from '../input-source/input-source'
import {XY} from '../../math/xy/xy'

export namespace PointerInput {
  export interface Pick extends Input {
    readonly source: InputSource.POINTER_PICK

    readonly bits: InputBit.PICK | 0

    /** The fractional position of the input in level coordinates. */
    readonly xy: XY
  }

  export interface Point extends Input {
    readonly source: InputSource.POINTER_POINT

    readonly bits: InputBit.POINT | 0

    /** The fractional position of the input in level coordinates. */
    readonly xy: XY
  }
}
