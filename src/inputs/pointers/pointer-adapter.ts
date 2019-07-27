import {ArrayUtil} from '../../utils/array-util'
import {InputBit} from '../input-bit'
import {InputSource} from '../input-source'
import {MousePickInput, MousePointInput} from './mouse-input'
import {Rect} from '../../math/rect'
import {Viewport} from '../../graphics/viewport'
import {
  VirtualButtonsPressedInput,
  VirtualJoystickAxesInput,
  VirtualJoystickPositionInput
} from './virtual-gamepad-input'
import {WH} from '../../math/wh'
import {XY} from '../../math/xy'

type DownInput =
  | MousePickInput
  | VirtualButtonsPressedInput
  | VirtualJoystickPositionInput
type MoveInput = MousePointInput | VirtualJoystickAxesInput

/** Converts PointerEvents to polled MouseInputs or virtual gamepad Inputs.
    Without this adapter, the Recorder must track which inputs to persist (roll
    over to prime the next sample) every update loop which complicates its
    logic. When all inputs are polled like Gamepad, the Recorder can safely
    start with a zeroed sample each loop since any carryover status will be
    provided by the underlying adapters. DownInputs persist until cleared by
    reset or pointerup. Only one DownInput and one MoveInput permitted per
    recording. If a bit is set and unset in the same frame, it is lost. */
export class PointerAdapter {
  static down(
    canvasWH: WH,
    cam: Rect,
    {pointerType, type, clientX, clientY}: PointerEvent
  ): DownInput {
    const mouse = pointerType === 'pen' || pointerType === 'mouse'
    const active = type === 'pointerdown'
    const xy = Viewport.toLevelXY({x: clientX, y: clientY}, canvasWH, cam)
    if (mouse) {
      const source = InputSource.MOUSE_PICK
      const bits = InputBit.PICK
      return {source, bits: active ? bits : 0, xy}
    }
    if (xy.x >= cam.x + cam.w / 2) {
      const source = InputSource.VIRTUAL_GAMEPAD_BUTTONS_PRESSED
      const bits = InputBit.ACTION // todo: collision detection with last location.
      return {source, bits: active ? bits : 0}
    }
    const source = InputSource.VIRTUAL_GAMEPAD_JOYSTICK_POSITION
    const bits = InputBit.POSITION_VIRTUAL_JOYSTICK
    return {source, bits: active ? bits : 0, xy}
  }

  /**
   * Converts a pointermove PointerEvent to a mouse record if the source is a
   * pen or mouse, otherwise a virtual joystick record.
   * @arg canvasWH The viewport dimensions in pixels.
   * @arg cam The coordinates and dimensions of the camera the input was made
   *          through.
   * @arg origin For virtual joystick inputs only, the fractional center of the
   *             joystick base in the level coordinate-system, usually the last
   *             pointerdown event.
   */
  static move(
    canvasWH: WH,
    cam: Rect,
    origin: XY,
    {pointerType, clientX, clientY}: PointerEvent
  ): MoveInput {
    let xy = Viewport.toLevelXY({x: clientX, y: clientY}, canvasWH, cam)

    if (pointerType === 'pen' || pointerType === 'mouse') {
      return {source: InputSource.MOUSE_POINT, bits: InputBit.POINT, xy}
    }

    // A point, xy, representing the stick is within or likely outside the
    // virtual joystick's base.
    //
    //   ─┼─────────▶ x
    //    │ o base
    //    │
    //    │
    //    │   . xy (stick)
    //    ▼ y
    //
    // Translate xy so that it's relative the center of the joystick's base.
    xy = XY.sub(xy, origin)

    // The magnitude or hypotenuse of the stick's position is |±√(x² + y²)|. The
    // division of each component's length by the magnitude is the normalized or
    // proportional length.
    //
    //   o base
    //   |\
    //   | \
    //   |  \
    //   |___\. xy
    //
    const magnitude = Math.sqrt(Math.pow(xy.x, 2) + Math.pow(xy.y, 2))
    const normal = magnitude ? XY.mul(xy, 1 / magnitude) : xy

    const source = InputSource.VIRTUAL_GAMEPAD_JOYSTICK_AXES
    const horizontal =
      Math.abs(normal.x) > 0.5 && magnitude > 10
        ? normal.x < 0
          ? InputBit.LEFT
          : InputBit.RIGHT
        : 0
    const vertical =
      Math.abs(normal.y) > 0.5 && magnitude > 10
        ? normal.y < 0
          ? InputBit.UP
          : InputBit.DOWN
        : 0
    const bits = horizontal | vertical
    return {source, bits, normal, magnitude}
  }

  /** Inputs persist until overwritten by the next input. */
  private _downInput?: DownInput
  private _moveInput?: MoveInput

  /** The last origin of the virtual joystick. */
  private _origin?: XY

  toInput(): readonly (DownInput | MoveInput)[] {
    const input = [this._downInput, this._moveInput].filter(ArrayUtil.is)
    if (this._moveInput && this._moveInput.source === InputSource.MOUSE_POINT) {
      this._moveInput = undefined
    }
    return input
  }

  adapt(canvasWH: WH, cam: Rect, event: PointerEvent, defaultOrigin: XY): void {
    if (event.type === 'pointermove') {
      this.onMove(canvasWH, cam, event, defaultOrigin)
    } else this.onDown(canvasWH, cam, event)
  }

  reset(): void {
    this._downInput = undefined
    this._moveInput = undefined
    this._origin = undefined
  }

  private onDown(canvasWH: WH, cam: Rect, event: PointerEvent) {
    const input = PointerAdapter.down(canvasWH, cam, event)
    if (input.source === InputSource.VIRTUAL_GAMEPAD_JOYSTICK_POSITION) {
      if (input.bits) this._origin = input.xy
      else this._moveInput = undefined
    }
    this._downInput = input
  }

  private onMove(
    canvasWH: WH,
    cam: Rect,
    event: PointerEvent,
    defaultOrigin: XY
  ): void {
    this._moveInput = PointerAdapter.move(
      canvasWH,
      cam,
      this._origin || defaultOrigin,
      event
    )
  }
}
