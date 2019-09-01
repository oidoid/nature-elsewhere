import {ArrayUtil} from '../../utils/array-util'
import {InputBit} from '../input-bit'
import {InputSource} from '../input-source'
import {PointerInput} from './pointer-input'
import {Rect} from '../../math/rect'
import {Viewport} from '../../graphics/viewport'
import {WH} from '../../math/wh'

/** Converts PointerEvents to polled PointerInputs. Without this adapter, the
    Recorder must track which inputs to persist (roll over to prime the next
    sample) every update loop which complicates its logic. When all inputs are
    polled like Gamepad, the Recorder can safely start with a zeroed sample each
    loop since any carryover status will be provided by the underlying adapters.
    Pick inputs persist until cleared by reset or pointerup. Only one Pick and
    one Point permitted per recording. If a bit is set and unset in the same
    frame, it is lost. */
export class PointerAdapter {
  static down(canvasWH: WH, cam: Rect, ev: PointerEvent): PointerInput.Pick {
    const active = ev.type === 'pointerdown'
    const xy = Viewport.toLevelXY({x: ev.clientX, y: ev.clientY}, canvasWH, cam)
    const source = InputSource.POINTER_PICK
    return {source, bits: active ? InputBit.PICK : 0, xy}
  }

  /**
   * Converts a pointermove PointerEvent to a pointer record.
   * @arg canvasWH The viewport dimensions in pixels.
   * @arg cam The coordinates and dimensions of the camera the input was made
   *          through.
   */
  static move(canvasWH: WH, cam: Rect, ev: PointerEvent): PointerInput.Point {
    let xy = Viewport.toLevelXY({x: ev.clientX, y: ev.clientY}, canvasWH, cam)
    return {source: InputSource.POINTER_POINT, bits: InputBit.POINT, xy}
  }

  /** Inputs persist until overwritten by the next input. */
  private _downInput?: PointerInput.Pick
  private _moveInput?: PointerInput.Point

  toInput(): readonly (PointerInput.Pick | PointerInput.Point)[] {
    const input = [this._downInput, this._moveInput].filter(ArrayUtil.is)
    this._moveInput = undefined
    return input
  }

  adapt(canvasWH: WH, cam: Rect, ev: PointerEvent): void {
    if (ev.type === 'pointermove')
      this._moveInput = PointerAdapter.move(canvasWH, cam, ev)
    else this._downInput = PointerAdapter.down(canvasWH, cam, ev)
  }

  reset(): void {
    this._downInput = undefined
    this._moveInput = undefined
  }
}
