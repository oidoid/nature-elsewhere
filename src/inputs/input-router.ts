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

export namespace InputRouter {
  export function make(
    window: Window,
    pointerRecorder: PointerRecorder = PointerRecorder.make()
  ): InputRouter {
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

  export function register(val: InputRouter, register: boolean): void {
    const fn = register ? 'addEventListener' : 'removeEventListener'
    ;['pointermove', 'pointerup', 'pointerdown'].forEach(ev =>
      val.window[fn](ev, val.onPointer)
    )
    val.window[fn]('keyup', <EventListenerOrEventListenerObject>val.onKey)
    val.window[fn]('keydown', <EventListenerOrEventListenerObject>val.onKey)
  }

  export function record(
    val: InputRouter,
    recorder: Recorder,
    canvasWH: WH,
    cam: Rect
  ): void {
    val.canvasWH = canvasWH
    val.cam = cam
    const input = {source: InputSource.KEYBOARD, bits: val.keyboardBits}
    Recorder.record(recorder, input)
    PointerRecorder.record(val.pointerRecorder, recorder)
    GamepadRecorder.record(recorder, val.window.navigator)
  }

  export function reset(val: InputRouter): void {
    ;(val.keyboardBits = 0), PointerRecorder.reset(val.pointerRecorder)
  }
}

function onKey(val: InputRouter, event: KeyboardEvent): void {
  val.keyboardBits = KeyboardRecorder.onKey(val.keyboardBits, event)
}

function onPointer(val: InputRouter, event: PointerEvent): void {
  PointerRecorder.onEvent(val.pointerRecorder, val.canvasWH, val.cam, event)
}
