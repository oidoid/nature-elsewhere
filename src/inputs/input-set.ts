import * as ArrayUtil from '../utils/array-util'
import {GamepadInput} from './gamepads/gamepad-input'
import {InputBit} from './input-bit'
import {InputSource} from './input-source'
import {KeyboardInput} from './keyboards/keyboard-input'
import {MousePickInput, MousePointInput} from './pointers/mouse-input'
import * as ObjectUtil from '../utils/object-util'
import {
  VirtualButtonsPositionInput,
  VirtualButtonsPressedInput,
  VirtualJoystickAxesInput,
  VirtualJoystickPositionInput
} from './pointers/virtual-gamepad-input'

/** All inputs possible in a single recording / update loop. */
export interface InputSet {
  readonly [InputSource.KEYBOARD]?: KeyboardInput
  readonly [InputSource.MOUSE_PICK]?: MousePickInput
  readonly [InputSource.MOUSE_POINT]?: MousePointInput
  readonly [InputSource.GAMEPAD]?: GamepadInput
  readonly [InputSource.VIRTUAL_GAMEPAD_JOYSTICK_POSITION]?: VirtualJoystickPositionInput
  readonly [InputSource.VIRTUAL_GAMEPAD_JOYSTICK_AXES]?: VirtualJoystickAxesInput
  readonly [InputSource.VIRTUAL_GAMEPAD_BUTTONS_POSITION]?: VirtualButtonsPressedInput
  readonly [InputSource.VIRTUAL_GAMEPAD_BUTTONS_PRESSED]?: VirtualButtonsPositionInput
}

export namespace InputSet {
  /** Coalesces and returns set bits. A set bit from any source overrides an
      unset bit from any other. */
  export function bits(set: InputSet): InputBit {
    const inputs = ObjectUtil.keys(set).map(source => set[source])
    return inputs
      .filter(ArrayUtil.is)
      .reduce((sum: number, {bits}) => sum | bits, 0)
  }
}
