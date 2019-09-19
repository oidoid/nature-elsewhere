import {InputBit} from './input-bit/input-bit'
import {InputSource} from './input-source/input-source'

export interface Input {
  readonly source: InputSource

  /** Zero or more InputBits. */
  readonly bits: InputBit | 0
}
