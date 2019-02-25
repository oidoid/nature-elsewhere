import * as object from '../../utils/object'
import {InputMask} from '../input-mask'
import {Recorder} from '../recorder'
import {
  StandardButton,
  StandardAxis,
  StandardAxisDirection
} from './standard-gamepad'

export type ButtonMap = Readonly<Record<number, InputMask>>
export type AxisMap = Readonly<
  Record<number, (direction: StandardAxisDirection) => InputMask>
>

export const defaultButtonMap: ButtonMap = object.freeze({
  [StandardButton.DPAD_LEFT]: InputMask.LEFT,
  [StandardButton.DPAD_RIGHT]: InputMask.RIGHT,
  [StandardButton.DPAD_UP]: InputMask.UP,
  [StandardButton.DPAD_DOWN]: InputMask.DOWN,
  [StandardButton.X]: InputMask.ACTION,
  [StandardButton.START]: InputMask.MENU
})

export const defaultAxisMap: AxisMap = object.freeze(<AxisMap>{
  [StandardAxis.LEFT_HORIZONTAL]: direction =>
    direction === StandardAxisDirection.LEFT ? InputMask.LEFT : InputMask.RIGHT,
  [StandardAxis.RIGHT_HORIZONTAL]: direction =>
    direction === StandardAxisDirection.LEFT ? InputMask.LEFT : InputMask.RIGHT,
  [StandardAxis.LEFT_VERTICAL]: direction =>
    direction === StandardAxisDirection.UP ? InputMask.UP : InputMask.DOWN,
  [StandardAxis.RIGHT_VERTICAL]: direction =>
    direction === StandardAxisDirection.UP ? InputMask.UP : InputMask.DOWN
})

export function pollGamepads(recorder: Recorder) {
  for (const gamepad of navigator.getGamepads()) {
    if (gamepad === null) continue
    gamepad.buttons.forEach((button, index) => {
      const input = defaultButtonMap[index]
      if (input) recorder.set(input, button.pressed)
    })
    gamepad.axes.forEach((axis, index) => {
      const input = defaultAxisMap[index]
        ? defaultAxisMap[index](Math.sign(axis))
        : undefined
      if (input) recorder.set(input, Math.abs(axis) > 0.5)
    })
  }
}
