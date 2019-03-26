import {GamepadRecorder} from './gamepads/gamepad-recorder'
import {KeyboardRecorder} from './keyboards/keyboard-recorder'
import {PointerRecorder} from './pointers/pointer-recorder'
import {Recorder} from './recorder'

export class InputRouter {
  private _registered: boolean = false
  private _viewport: WH = {w: 0, h: 0}
  private _cam: Rect = {x: 0, y: 0, w: 0, h: 0}
  private _defaultOrigin: XY = {x: 0, y: 0}
  constructor(
    private readonly _window: Window,
    private readonly _canvas: HTMLCanvasElement,
    private readonly _keyboardRecorder: KeyboardRecorder = new KeyboardRecorder(),
    private readonly _pointerRecorder: PointerRecorder = new PointerRecorder()
  ) {
    this.onKey = this.onKey.bind(this)
    this.onPointerMove = this.onPointerMove.bind(this)
    this.onPointerDown = this.onPointerDown.bind(this)
  }

  register(): void {
    if (this._registered) return
    this._window.document.addEventListener('keydown', this.onKey)
    this._window.document.addEventListener('keyup', this.onKey)
    this._canvas.addEventListener('pointerdown', this.onPointerDown)
    this._canvas.addEventListener('pointerup', this.onPointerDown)
    this._canvas.addEventListener('pointermove', this.onPointerMove)
    this._registered = true
  }

  deregister(): void {
    if (!this._registered) return
    this._canvas.addEventListener('pointermove', this.onPointerMove)
    this._canvas.addEventListener('pointerup', this.onPointerDown)
    this._canvas.addEventListener('pointerdown', this.onPointerDown)
    this._window.document.addEventListener('keyup', this.onKey)
    this._window.document.addEventListener('keydown', this.onKey)
    this._registered = false
  }

  record(recorder: Recorder, viewport: WH, cam: Rect, defaultOrigin: XY): void {
    this._viewport = viewport
    this._cam = cam
    this._defaultOrigin = defaultOrigin
    this._keyboardRecorder.record(recorder)
    this._pointerRecorder.record(recorder)
    GamepadRecorder.record(recorder, this._window.navigator)
  }

  reset(): void {
    this._keyboardRecorder.reset()
    this._pointerRecorder.reset()
  }

  private onKey(event: KeyboardEvent): void {
    this._keyboardRecorder.onKey(event)
  }

  private onPointerMove(event: PointerEvent): void {
    this._pointerRecorder.onEvent(
      this._viewport,
      this._cam,
      event,
      this._defaultOrigin
    )
  }

  private onPointerDown(event: PointerEvent): void {
    this._pointerRecorder.onEvent(
      this._viewport,
      this._cam,
      event,
      this._defaultOrigin
    )
  }
}
