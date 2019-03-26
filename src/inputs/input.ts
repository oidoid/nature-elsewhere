import {InputBit} from './input-bit'
import {InputSource} from './input-source'

export interface Input {
  readonly source: InputSource

  /** Zero or more InputBits. */
  readonly bits: InputBit | 0
}
