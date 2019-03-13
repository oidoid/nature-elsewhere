import {InputBit} from './input-bit'
import {ObjectUtil} from '../utils/object-util'
import {Recorder} from './recorder'

export namespace Pointer {
  export type Button = PointerEvent['button']

  export type ButtonMap = Readonly<Record<Button, InputBit>>

  export const defaultButtonMap: ButtonMap = ObjectUtil.freeze({
    0: InputBit.PICK
  })

  export function onPick(recorder: Recorder, event: PointerEvent): void {
    const button = defaultButtonMap[event.button]
    if (button === undefined) return
    const active = event.type === 'pointerdown'
    recorder.set(button, active, {x: event.clientX, y: event.clientY})

    event.preventDefault()
  }

  export function onMove(recorder: Recorder, event: PointerEvent): void {
    const button = InputBit.POINT
    const active = true
    recorder.set(button, active, {x: event.clientX, y: event.clientY})
    event.preventDefault()
  }
}
