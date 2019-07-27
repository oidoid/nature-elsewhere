import {ArrayUtil} from '../../utils/array-util'
import * as defaultGamepadMap from '../../assets/inputs/default-gamepad-map.json'
import {InputBit, InvertInputBitDirection} from '../input-bit'
import {InputSource} from '../input-source'
import {Recorder} from '../recorder'

export namespace GamepadRecorder {
  // [+-∞] --[Gamepad]--> [GamepadRecorder] --Input--> [Recorder]
  export type ButtonMap = Readonly<
    Partial<Record<string, keyof typeof InputBit>>
  >
  export type AxisMap = Readonly<Partial<Record<string, keyof typeof InputBit>>>

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
    return sum | (button.pressed ? buttonIndexToInputBit(index) : 0)
  }

  function buttonIndexToInputBit(index: number): InputBit {
    const key = (<ButtonMap>defaultGamepadMap.buttons)[index]
    return key ? InputBit[key] : 0
  }

  function reduceAxes(sum: InputBit, axis: number, index: number): InputBit {
    const bit = axisIndexToInputBit(index, Math.sign(axis))
    return sum | (bit && Math.abs(axis) > 0.5 ? bit : 0)
  }

  function axisIndexToInputBit(index: number, direction: number): InputBit {
    const key = (<AxisMap>defaultGamepadMap.axes)[index]
    if (!key) return 0
    return direction < 0 ? InputBit[key] : InvertInputBitDirection[key] || 0
  }
}
