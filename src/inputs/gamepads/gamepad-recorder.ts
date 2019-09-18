import * as defaultGamepadMap from '../../assets/inputs/default-gamepad-map.json'
import {InputBit, InvertInputBitDirection} from '../input-bit'
import {InputSource} from '../input-source'
import {Recorder} from '../recorder'
import {ValueUtil} from '../../utils/value-util'

export namespace GamepadRecorder {
  // [+-∞] --[Gamepad]--> [GamepadRecorder] --Input--> [Recorder]
  export interface ButtonMap
    extends Readonly<Partial<Record<string, InputBit.Key>>> {}
  export interface AxisMap
    extends Readonly<Partial<Record<string, InputBit.Key>>> {}

  export function record(recorder: Recorder, navigator: Navigator): void {
    const gamepads = Array.from(navigator.getGamepads())
    const bits = gamepads.filter(ValueUtil.is).reduce(reduceGamepads, 0)
    Recorder.record(recorder, {source: InputSource.GAMEPAD, bits})
  }

  function reduceGamepads(ret: InputBit, {buttons, axes}: Gamepad): InputBit {
    return ret | buttons.reduce(reduceButtons, 0) | axes.reduce(reduceAxes, 0)
  }

  function reduceButtons(
    ret: InputBit,
    button: GamepadButton,
    index: number
  ): InputBit {
    return ret | (button.pressed ? buttonIndexToInputBit(index) : 0)
  }

  function buttonIndexToInputBit(index: number): InputBit {
    const key = (<ButtonMap>defaultGamepadMap.buttons)[index]
    return key ? InputBit[key] : 0
  }

  function reduceAxes(ret: InputBit, axis: number, index: number): InputBit {
    const bit = axisIndexToInputBit(index, Math.sign(axis))
    return ret | (bit && Math.abs(axis) > 0.5 ? bit : 0)
  }

  function axisIndexToInputBit(index: number, direction: number): InputBit {
    const key = (<AxisMap>defaultGamepadMap.axes)[index]
    if (!key) return 0
    return direction < 0 ? InputBit[key] : InvertInputBitDirection[key] || 0
  }
}
