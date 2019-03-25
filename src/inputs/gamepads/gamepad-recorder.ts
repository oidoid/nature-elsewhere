import {ArrayUtil} from '../../utils/array-util'
import {InputBit} from '../input-bit'
import {InputSource} from '../input-source'
import {ObjectUtil} from '../../utils/object-util'
import {Recorder} from '../recorder'
import {StandardGamepad} from './standard-gamepad'

// [+-∞] --[Gamepad]--> [GamepadRecorder] --Input--> [Recorder]
export namespace GamepadRecorder {
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

  export function record(recorder: Recorder, navigator: Navigator): void {
    const gamepads = Array.from(navigator.getGamepads())
    const bits = gamepads.filter(ArrayUtil.is).reduce(reduceGamepads, 0)
    recorder.record({source: InputSource.GAMEPAD, bits})
  }

  function reduceGamepads(sum: InputBit, {buttons, axes}: Gamepad): InputBit {
    return sum | buttons.reduce(reduceButtons, 0) | axes.reduce(reduceAxes, 0)
  }

  function reduceButtons(
    sum: InputBit,
    button: GamepadButton,
    index: number
  ): InputBit {
    return sum | (button.pressed ? defaultButtonMap[index] : 0)
  }

  function reduceAxes(sum: InputBit, axis: number, index: number): InputBit {
    const bit = (defaultAxisMap[index] || (() => 0))(Math.sign(axis))
    return sum | (bit && Math.abs(axis) > 0.5 ? bit : 0)
  }
}
