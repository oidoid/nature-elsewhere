import {Keyboard} from './keyboard'
import {Pointer} from './pointer'
import {Recorder} from './recorder'

export class InputEventListener {
  private _registered: boolean = false
  constructor(
    private readonly _window: Window,
    private readonly _canvas: HTMLCanvasElement,
    private readonly _recorder: Recorder
  ) {
    this.onKey = this.onKey.bind(this)
    this.onPointerMove = this.onPointerMove.bind(this)
    this.onPointerPick = this.onPointerPick.bind(this)
  }

  register(): void {
    if (this._registered) return
    this._window.document.addEventListener('keydown', this.onKey)
    this._window.document.addEventListener('keyup', this.onKey)
    this._canvas.addEventListener('pointerdown', this.onPointerPick)
    this._canvas.addEventListener('pointerup', this.onPointerPick)
    this._canvas.addEventListener('pointermove', this.onPointerMove)
    this._registered = true
  }

  deregister(): void {
    if (!this._registered) return
    this._canvas.addEventListener('pointermove', this.onPointerMove)
    this._canvas.addEventListener('pointerup', this.onPointerPick)
    this._canvas.addEventListener('pointerdown', this.onPointerPick)
    this._window.document.addEventListener('keyup', this.onKey)
    this._window.document.addEventListener('keydown', this.onKey)
    this._registered = false
  }

  private onKey(event: KeyboardEvent): void {
    Keyboard.onKey(this._recorder, event)
  }

  private onPointerMove(event: PointerEvent): void {
    Pointer.onMove(this._recorder, event)
  }

  private onPointerPick(event: PointerEvent): void {
    Pointer.onPick(this._recorder, event)
  }
}
