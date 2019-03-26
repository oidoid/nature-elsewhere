import {Input} from '../input'
import {InputBit} from '../input-bit'
import {InputSource} from '../input-source'

export interface VirtualJoystickPositionInput extends Input {
  readonly source: InputSource.VIRTUAL_GAMEPAD_JOYSTICK_POSITION

  readonly bits: InputBit.POSITION_VIRTUAL_JOYSTICK | 0

  /** The last known fractional position of the center of the joystick in level
      coordinates. */
  readonly xy: XY
}

export interface VirtualJoystickAxesInput extends Input {
  readonly source: InputSource.VIRTUAL_GAMEPAD_JOYSTICK_AXES

  readonly bits:
    | InputBit.LEFT
    | InputBit.RIGHT
    | InputBit.UP
    | InputBit.DOWN
    | 0

  /** The normalized components of the axes in [-1, 1]. */
  readonly normal: XY

  /**
   * The nonnegative fractional length from the center of the stick to the
   * center of the base. This value may exceed the radius of the joystick base
   * and should be capped when calculating stick render location.
   *
   * The product of each normalized component and the radius would be the
   * position of the stick on the perimeter. If the lesser length of the radius
   * and the magnitude is used instead, the stick may be positioned anywhere
   * within the radius.
   *
   * Truncate the results when rendering to avoid possible asymmetry in the
   * limits of the stick. For example, the stick may be allowed to extend one
   * pixel further on two sides.
   */
  readonly magnitude: number
}

export interface VirtualButtonsPositionInput extends Input {
  readonly source: InputSource.VIRTUAL_GAMEPAD_BUTTONS_POSITION

  readonly bits: InputBit.POSITION_VIRTUAL_BUTTONS | 0

  /** The last known fractional position of the center of the buttons in level
      coordinates. */
  readonly xy: XY
}

export interface VirtualButtonsPressedInput extends Input {
  readonly source: InputSource.VIRTUAL_GAMEPAD_BUTTONS_PRESSED
}
