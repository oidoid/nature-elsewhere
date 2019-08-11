import {ArrayUtil} from '../utils/array-util'
import {Input} from './input'
import {InputBit} from './input-bit'
import {InputSource} from './input-source'
import {MouseInput} from './pointers/mouse-input'
import {ObjectUtil} from '../utils/object-util'
import {VirtualGamepadInput} from './pointers/virtual-gamepad-input'

/** All inputs possible in a single recording / update loop. */
export interface InputSet {
  readonly [InputSource.KEYBOARD]?: Input
  readonly [InputSource.MOUSE_PICK]?: MouseInput.Pick
  readonly [InputSource.MOUSE_POINT]?: MouseInput.Point
  readonly [InputSource.GAMEPAD]?: Input
  readonly [InputSource.VIRTUAL_GAMEPAD_JOYSTICK_POSITION]?: VirtualGamepadInput.JoystickPosition
  readonly [InputSource.VIRTUAL_GAMEPAD_JOYSTICK_AXES]?: VirtualGamepadInput.JoystickAxes
  readonly [InputSource.VIRTUAL_GAMEPAD_BUTTONS_POSITION]?: VirtualGamepadInput.ButtonsPressed
  readonly [InputSource.VIRTUAL_GAMEPAD_BUTTONS_PRESSED]?: VirtualGamepadInput.ButtonsPosition
}

export namespace InputSet {
  /** Coalesces and returns set bits. A set bit from any source overrides an
      unset bit from any other. */
  export function bits(set: InputSet): InputBit {
    return ObjectUtil.values(set)
      .filter(ArrayUtil.is)
      .reduce((sum: number, {bits}) => sum | bits, 0)
  }
}
