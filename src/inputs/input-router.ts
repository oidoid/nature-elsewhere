import {GamepadRecorder} from './gamepads/gamepad-recorder'
import {InputSource} from './input-source'
import {KeyboardRecorder} from './keyboards/keyboard-recorder'
import {PointerRecorder} from './pointers/pointer-recorder'
import {Recorder} from './recorder'
import {Rect} from '../math/rect'
import {WH} from '../math/wh'

export interface InputRouter {
  canvasWH: WH
  cam: Rect
  keyboardBits: number
  readonly window: Window
  readonly pointerRecorder: PointerRecorder
  onKey(ev: KeyboardEvent): void
  onPointer(ev: Event): void
}
type t = InputRouter

export namespace InputRouter {
  export const make = (
    window: Window,
    pointerRecorder: PointerRecorder = PointerRecorder.make()
  ): t => {
    const ret = {
      canvasWH: {w: 0, h: 0},
      cam: {x: 0, y: 0, w: 0, h: 0},
      keyboardBits: 0,
      window,
      pointerRecorder,
      onKey: (ev: KeyboardEvent) => onKey(ret, ev),
      onPointer: (ev: PointerEvent) => onPointer(ret, ev)
    }
    return ret
  }

  export const register = (val: t, register: boolean): void => {
    const fn = register ? 'addEventListener' : 'removeEventListener'
    ;['pointermove', 'pointerup', 'pointerdown'].forEach(ev =>
      val.window[fn](ev, val.onPointer)
    )
    val.window[fn]('keyup', <EventListenerOrEventListenerObject>val.onKey)
    val.window[fn]('keydown', <EventListenerOrEventListenerObject>val.onKey)
  }

  export const record = (
    val: t,
    recorder: Recorder,
    viewport: WH,
    cam: Rect
  ): void => {
    val.canvasWH = viewport
    val.cam = cam
    const input = {source: InputSource.KEYBOARD, bits: val.keyboardBits}
    Recorder.record(recorder, input)
    PointerRecorder.record(val.pointerRecorder, recorder)
    GamepadRecorder.record(recorder, val.window.navigator)
  }

  export const reset = (val: t): void => (
    (val.keyboardBits = 0), PointerRecorder.reset(val.pointerRecorder)
  )
}

const onKey = (val: t, event: KeyboardEvent): void => {
  val.keyboardBits = KeyboardRecorder.onKey(val.keyboardBits, event)
}

const onPointer = (val: t, event: PointerEvent): void =>
  PointerRecorder.onEvent(val.pointerRecorder, val.canvasWH, val.cam, event)
