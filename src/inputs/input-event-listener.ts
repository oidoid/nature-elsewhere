import * as keyboard from './keyboard'
import * as mouse from './mouse'
import {Recorder} from './recorder'

export class InputEventListener {
  private _registered: boolean = false
  constructor(
    private readonly _window: Window,
    private readonly _canvas: HTMLCanvasElement,
    private readonly _recorder: Recorder
  ) {
    this.onKeyChange = this.onKeyChange.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseClickChange = this.onMouseClickChange.bind(this)
  }

  register(): void {
    if (this._registered) return
    this._window.document.addEventListener('keydown', this.onKeyChange)
    this._window.document.addEventListener('keyup', this.onKeyChange)
    this._canvas.addEventListener('mousedown', this.onMouseClickChange)
    this._canvas.addEventListener('mouseup', this.onMouseClickChange)
    this._canvas.addEventListener('mousemove', this.onMouseMove)
    this._registered = true
  }

  deregister(): void {
    if (!this._registered) return
    this._canvas.addEventListener('mousemove', this.onMouseMove)
    this._canvas.addEventListener('mouseup', this.onMouseClickChange)
    this._canvas.addEventListener('mousedown', this.onMouseClickChange)
    this._window.document.addEventListener('keyup', this.onKeyChange)
    this._window.document.addEventListener('keydown', this.onKeyChange)
    this._registered = false
  }

  private onKeyChange(event: KeyboardEvent): void {
    keyboard.onKeyChange(this._recorder, event)
  }

  private onMouseMove(event: MouseEvent): void {
    mouse.onMouseMove(this._recorder, event)
  }

  private onMouseClickChange(event: MouseEvent): void {
    mouse.onMouseClickChange(this._recorder, event)
  }
}
