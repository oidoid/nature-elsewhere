import {Input} from '../input'
import {InputBit} from '../input-bit'
import {InputSource} from '../input-source'

export interface MousePickInput extends Input {
  readonly source: InputSource.MOUSE_PICK

  readonly bits: InputBit.PICK

  /** The fractional position of the input in level coordinates. */
  readonly xy: XY
}

export interface MousePointInput extends Input {
  readonly source: InputSource.MOUSE_POINT

  readonly bits: InputBit.POINT

  /** The fractional position of the input in level coordinates. */
  readonly xy: XY
}
