import {Input} from './input'
import {InputBit} from './input-bit/input-bit'
import {InputSource} from './input-source/input-source'
import {PointerInput} from './pointers/pointer-input'
import {ValueUtil} from '../utils/value-util'

/** All inputs possible in a single recording / update loop. */
export interface InputSet {
  readonly [InputSource.KEYBOARD]?: Input
  readonly [InputSource.POINTER_PICK]?: PointerInput.Pick
  readonly [InputSource.POINTER_POINT]?: PointerInput.Point
  readonly [InputSource.GAMEPAD]?: Input
}

export namespace InputSet {
  /** Coalesces and returns set bits. A set bit from any source overrides an
      unset bit from any other. */
  export function bits(val: InputSet): InputBit {
    return Object.values(val)
      .filter(ValueUtil.is)
      .reduce((ret: number, {bits}) => ret | bits, 0)
  }
}
