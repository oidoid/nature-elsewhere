import {InputMask} from '../input-mask'
import {ObjectUtil} from '../../utils/object-util'
import {Recorder} from '../recorder'
import {StandardGamepad} from './standard-gamepad'

export namespace Gamepad {
  export type ButtonMap = Readonly<Record<number, InputMask>>
  export type AxisMap = Readonly<
    Record<number, (direction: StandardGamepad.AxisDirection) => InputMask>
  >

  export const defaultButtonMap: ButtonMap = ObjectUtil.freeze({
    [StandardGamepad.Button.DPAD_LEFT]: InputMask.LEFT,
    [StandardGamepad.Button.DPAD_RIGHT]: InputMask.RIGHT,
    [StandardGamepad.Button.DPAD_UP]: InputMask.UP,
    [StandardGamepad.Button.DPAD_DOWN]: InputMask.DOWN,
    [StandardGamepad.Button.X]: InputMask.ACTION,
    [StandardGamepad.Button.START]: InputMask.MENU
  })

  export const defaultAxisMap: AxisMap = ObjectUtil.freeze(<AxisMap>{
    [StandardGamepad.Axis.LEFT_HORIZONTAL]: direction =>
      direction === StandardGamepad.AxisDirection.LEFT
        ? InputMask.LEFT
        : InputMask.RIGHT,
    [StandardGamepad.Axis.RIGHT_HORIZONTAL]: direction =>
      direction === StandardGamepad.AxisDirection.LEFT
        ? InputMask.LEFT
        : InputMask.RIGHT,
    [StandardGamepad.Axis.LEFT_VERTICAL]: direction =>
      direction === StandardGamepad.AxisDirection.UP
        ? InputMask.UP
        : InputMask.DOWN,
    [StandardGamepad.Axis.RIGHT_VERTICAL]: direction =>
      direction === StandardGamepad.AxisDirection.UP
        ? InputMask.UP
        : InputMask.DOWN
  })

  export function poll(recorder: Recorder) {
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
}
