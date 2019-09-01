import {ArrayUtil} from '../utils/array-util'
import {Input} from './input'
import {InputBit} from './input-bit'
import {InputSource} from './input-source'
import {ObjectUtil} from '../utils/object-util'
import {PointerInput} from './pointers/pointer-input'

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
    return ObjectUtil.values(val)
      .filter(ArrayUtil.is)
      .reduce((sum: number, {bits}) => sum | bits, 0)
  }
}
