import {InputMask} from './input-mask'
import {Recorder} from './recorder'

export type Button = MouseEvent['button']

export type ButtonMap = Readonly<Record<Button, InputMask>>

export const defaultButtonMap: ButtonMap = {
  0: InputMask.PICK
}

export function onMouseClickChange(
  recorder: Recorder,
  canvas: WH,
  cam: Rect,
  event: MouseEvent
): void {
  const button = defaultButtonMap[event.button]
  if (button === undefined) return
  const active = event.type === 'mousedown'
  const xy = clientToWorld({x: event.clientX, y: event.clientY}, canvas, cam)
  recorder.set(button, active, xy)

  event.preventDefault()
}

export function onMouseMove(
  recorder: Recorder,
  canvas: WH,
  cam: Rect,
  event: MouseEvent
): void {
  const button = InputMask.POINT
  const active = true
  const xy = clientToWorld({x: event.clientX, y: event.clientY}, canvas, cam)
  recorder.set(button, active, xy)

  event.preventDefault()
}

function clientToWorld({x, y}: XY, canvas: WH, cam: Rect): XY {
  return {x: cam.x + (x / canvas.w) * cam.w, y: cam.y + (y / canvas.h) * cam.h}
}
