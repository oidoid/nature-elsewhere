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
  export const make = (
    window: Window,
    pointerRecorder: PointerRecorder = PointerRecorder.make()
  ): InputRouter => {
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

  export const register = (state: InputRouter, register: boolean): void => {
    const fn = register ? 'addEventListener' : 'removeEventListener'
    ;['pointermove', 'pointerup', 'pointerdown'].forEach(ev =>
      state.window[fn](ev, state.onPointer)
    )
    state.window[fn]('keyup', <EventListenerOrEventListenerObject>state.onKey)
    state.window[fn]('keydown', <EventListenerOrEventListenerObject>state.onKey)
  }

  export const record = (
    state: InputRouter,
    recorder: Recorder,
    viewport: WH,
    cam: Rect
  ): void => {
    state.canvasWH = viewport
    state.cam = cam
    const input = {source: InputSource.KEYBOARD, bits: state.keyboardBits}
    Recorder.record(recorder, input)
    PointerRecorder.record(state.pointerRecorder, recorder)
    GamepadRecorder.record(recorder, state.window.navigator)
  }

  export const reset = (state: InputRouter): void => {
    ;(state.keyboardBits = 0), PointerRecorder.reset(state.pointerRecorder)
  }
}

const onKey = (state: InputRouter, event: KeyboardEvent): void => {
  state.keyboardBits = KeyboardRecorder.onKey(state.keyboardBits, event)
}

const onPointer = (state: InputRouter, event: PointerEvent): void =>
  PointerRecorder.onEvent(
    state.pointerRecorder,
    state.canvasWH,
    state.cam,
    event
  )
