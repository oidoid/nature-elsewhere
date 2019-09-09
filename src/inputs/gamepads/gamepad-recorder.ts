import {ArrayUtil} from '../../utils/array-util'
import * as defaultGamepadMap from '../../assets/inputs/default-gamepad-map.json'
import {InputBit, InvertInputBitDirection} from '../input-bit'
import {InputSource} from '../input-source'
import {Recorder} from '../recorder'

export namespace GamepadRecorder {
  // [+-∞] --[Gamepad]--> [GamepadRecorder] --Input--> [Recorder]
  export type ButtonMap = Readonly<Partial<Record<string, InputBit.Key>>>
  export type AxisMap = Readonly<Partial<Record<string, InputBit.Key>>>

  export const record = (recorder: Recorder, navigator: Navigator): void => {
    const gamepads = Array.from(navigator.getGamepads())
    const bits = gamepads.filter(ArrayUtil.is).reduce(reduceGamepads, 0)
    Recorder.record(recorder, {source: InputSource.GAMEPAD, bits})
  }

  const reduceGamepads = (ret: InputBit, {buttons, axes}: Gamepad): InputBit =>
    ret | buttons.reduce(reduceButtons, 0) | axes.reduce(reduceAxes, 0)

  const reduceButtons = (
    ret: InputBit,
    button: GamepadButton,
    index: number
  ): InputBit => ret | (button.pressed ? buttonIndexToInputBit(index) : 0)

  const buttonIndexToInputBit = (index: number): InputBit => {
    const key = (<ButtonMap>defaultGamepadMap.buttons)[index]
    return key ? InputBit[key] : 0
  }

  const reduceAxes = (ret: InputBit, axis: number, index: number): InputBit => {
    const bit = axisIndexToInputBit(index, Math.sign(axis))
    return ret | (bit && Math.abs(axis) > 0.5 ? bit : 0)
  }

  const axisIndexToInputBit = (index: number, direction: number): InputBit => {
    const key = (<AxisMap>defaultGamepadMap.axes)[index]
    if (!key) return 0
    return direction < 0 ? InputBit[key] : InvertInputBitDirection[key] || 0
  }
}
