import {InputMask} from './input-mask'
import {Recorder} from './recorder'

export type Button = MouseEvent['button']

export type ButtonMap = Readonly<Record<Button, InputMask>>

export const defaultButtonMap: ButtonMap = {
  0: InputMask.PICK
}

export function onMouseClickChange(
  recorder: Recorder,
  event: MouseEvent
): void {
  const button = defaultButtonMap[event.button]
  if (button === undefined) return
  const active = event.type === 'mousedown'
  recorder.set(button, active, {x: event.clientX, y: event.clientY})

  event.preventDefault()
}

export function onMouseMove(recorder: Recorder, event: MouseEvent): void {
  const button = InputMask.POINT
  const active = true
  recorder.set(button, active, {x: event.clientX, y: event.clientY})
  event.preventDefault()
}
