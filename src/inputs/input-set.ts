import {GamepadInput} from './gamepads/gamepad-input'
import {InputSource} from './input-source'
import {KeyboardInput} from './keyboards/keyboard-input'
import {MousePickInput, MousePointInput} from './pointers/mouse-input'
import {
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
}
