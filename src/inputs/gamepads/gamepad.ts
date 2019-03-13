import {InputBit} from '../input-bit'
import {ObjectUtil} from '../../utils/object-util'
import {Recorder} from '../recorder'
import {StandardGamepad} from './standard-gamepad'

export namespace Gamepad {
  export type ButtonMap = Readonly<Record<number, InputBit>>
  export type AxisMap = Readonly<
    Record<number, (direction: StandardGamepad.AxisDirection) => InputBit>
  >

  export const defaultButtonMap: ButtonMap = ObjectUtil.freeze({
    [StandardGamepad.Button.DPAD_LEFT]: InputBit.LEFT,
    [StandardGamepad.Button.DPAD_RIGHT]: InputBit.RIGHT,
    [StandardGamepad.Button.DPAD_UP]: InputBit.UP,
    [StandardGamepad.Button.DPAD_DOWN]: InputBit.DOWN,
    [StandardGamepad.Button.X]: InputBit.ACTION,
    [StandardGamepad.Button.START]: InputBit.MENU
  })

  export const defaultAxisMap: AxisMap = ObjectUtil.freeze(<AxisMap>{
    [StandardGamepad.Axis.LEFT_HORIZONTAL]: direction =>
      direction === StandardGamepad.AxisDirection.LEFT
        ? InputBit.LEFT
        : InputBit.RIGHT,
    [StandardGamepad.Axis.RIGHT_HORIZONTAL]: direction =>
      direction === StandardGamepad.AxisDirection.LEFT
        ? InputBit.LEFT
        : InputBit.RIGHT,
    [StandardGamepad.Axis.LEFT_VERTICAL]: direction =>
      direction === StandardGamepad.AxisDirection.UP
        ? InputBit.UP
        : InputBit.DOWN,
    [StandardGamepad.Axis.RIGHT_VERTICAL]: direction =>
      direction === StandardGamepad.AxisDirection.UP
        ? InputBit.UP
        : InputBit.DOWN
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
