import * as keyboard from './keyboard'
import * as pointer from './pointer'
import {Recorder} from './recorder'

export class InputEventListener {
  private _registered: boolean = false
  constructor(
    private readonly _window: Window,
    private readonly _canvas: HTMLCanvasElement,
    private readonly _recorder: Recorder
  ) {
    this.onKeyChange = this.onKeyChange.bind(this)
    this.onPointerMove = this.onPointerMove.bind(this)
    this.onPointerPick = this.onPointerPick.bind(this)
  }

  register(): void {
    if (this._registered) return
    this._window.document.addEventListener('keydown', this.onKeyChange)
    this._window.document.addEventListener('keyup', this.onKeyChange)
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
    this._window.document.addEventListener('keyup', this.onKeyChange)
    this._window.document.addEventListener('keydown', this.onKeyChange)
    this._registered = false
  }

  private onKeyChange(event: KeyboardEvent): void {
    keyboard.onKeyChange(this._recorder, event)
  }

  private onPointerMove(event: PointerEvent): void {
    pointer.onPointerMove(this._recorder, event)
  }

  private onPointerPick(event: PointerEvent): void {
    pointer.onPointerPick(this._recorder, event)
  }
}
