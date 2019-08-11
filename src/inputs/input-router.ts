import {GamepadRecorder} from './gamepads/gamepad-recorder'
import {InputSource} from './input-source'
import {KeyboardRecorder} from './keyboards/keyboard-recorder'
import {PointerRecorder} from './pointers/pointer-recorder'
import {Recorder} from './recorder'
import {Rect} from '../math/rect'
import {WH} from '../math/wh'
import {XY} from '../math/xy'

export class InputRouter {
  private _registered: boolean = false
  private _canvasWH: WH = {w: 0, h: 0}
  private _cam: Rect = {x: 0, y: 0, w: 0, h: 0}
  private _defaultOrigin: XY = {x: 0, y: 0}
  private keyboardBits: number = 0
  constructor(
    private readonly _window: Window,
    private readonly _pointerRecorder: PointerRecorder = new PointerRecorder()
  ) {
    this.onKey = this.onKey.bind(this)
    this.onPointerMove = this.onPointerMove.bind(this)
    this.onPointerDown = this.onPointerDown.bind(this)
  }

  register(): void {
    if (this._registered) return
    this._register(true)
    this._registered = true
  }

  deregister(): void {
    if (!this._registered) return
    this._register(false)
    this._registered = false
  }

  record(recorder: Recorder, viewport: WH, cam: Rect, defaultOrigin: XY): void {
    this._canvasWH = viewport
    this._cam = cam
    this._defaultOrigin = defaultOrigin
    const input = {source: InputSource.KEYBOARD, bits: this.keyboardBits}
    Recorder.record(recorder, input)
    this._pointerRecorder.record(recorder)
    GamepadRecorder.record(recorder, this._window.navigator)
  }

  reset(): void {
    this.keyboardBits = 0
    this._pointerRecorder.reset()
  }

  private onKey(event: KeyboardEvent): void {
    this.keyboardBits = KeyboardRecorder.onKey(this.keyboardBits, event)
  }

  private onPointerMove(event: PointerEvent): void {
    this._pointerRecorder.onEvent(
      this._canvasWH,
      this._cam,
      event,
      this._defaultOrigin
    )
  }

  private onPointerDown(event: PointerEvent): void {
    this._pointerRecorder.onEvent(
      this._canvasWH,
      this._cam,
      event,
      this._defaultOrigin
    )
  }

  private _register(register: boolean): void {
    const fn = register ? 'addEventListener' : 'removeEventListener'
    this._window[fn]('pointermove', <any>this.onPointerMove)
    this._window[fn]('pointerup', <any>this.onPointerDown)
    this._window[fn]('pointerdown', <any>this.onPointerDown)
    this._window[fn]('keyup', <any>this.onKey)
    this._window[fn]('keydown', <any>this.onKey)
  }
}
