import {InputBit} from './input-bit'
import {InputSource} from './input-source'

export interface Input {
  readonly source: InputSource

  /** One or more InputBits. */
  readonly bits: InputBit
}
