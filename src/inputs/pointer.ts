import * as object from '../utils/object'
import {InputMask} from './input-mask'
import {Recorder} from './recorder'

export type Button = PointerEvent['button']

export type ButtonMap = Readonly<Record<Button, InputMask>>

export const defaultButtonMap: ButtonMap = object.freeze({
  0: InputMask.PICK
})

export function onPointerPick(recorder: Recorder, event: PointerEvent): void {
  const button = defaultButtonMap[event.button]
  if (button === undefined) return
  const active = event.type === 'pointerdown'
  recorder.set(button, active, {x: event.clientX, y: event.clientY})

  event.preventDefault()
}

export function onPointerMove(recorder: Recorder, event: PointerEvent): void {
  const button = InputMask.POINT
  const active = true
  recorder.set(button, active, {x: event.clientX, y: event.clientY})
  event.preventDefault()
}
