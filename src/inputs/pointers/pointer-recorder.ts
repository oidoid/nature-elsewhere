import {ArrayUtil} from '../../utils/array-util'
import {InputBit} from '../input-bit'
import {InputSource} from '../input-source'
import {PointerInput} from './pointer-input'
import {Recorder} from '../recorder'
import {Rect} from '../../math/rect'
import {Viewport} from '../../graphics/viewport'
import {WH} from '../../math/wh'

export interface PointerRecorder {
  point?: PointerInput.Point
  pick?: PointerInput.Pick
}
type t = PointerRecorder

export namespace PointerRecorder {
  export const make = (): t => ({})

  export const record = (state: t, recorder: Recorder): void => {
    const inputs = [state.pick, state.point].filter(ArrayUtil.is)
    inputs.forEach(input => Recorder.record(recorder, input))
  }

  export const reset = (state: t): void => {
    delete state.point, delete state.pick
  }

  export const onEvent = (
    state: t,
    canvasWH: WH,
    cam: Rect,
    ev: PointerEvent
  ): void => {
    if ((!state.pick || !state.pick.bits) && ev.type === 'pointermove')
      state.point = point(canvasWH, cam, ev)
    else state.pick = pick(canvasWH, cam, ev)
    ev.preventDefault()
  }
}

const pick = (canvasWH: WH, cam: Rect, ev: PointerEvent): PointerInput.Pick => {
  const active = ev.type === 'pointerdown' || ev.type === 'pointermove'
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
const point = (
  canvasWH: WH,
  cam: Rect,
  ev: PointerEvent
): PointerInput.Point => {
  const xy = Viewport.toLevelXY({x: ev.clientX, y: ev.clientY}, canvasWH, cam)
  return {source: InputSource.POINTER_POINT, bits: InputBit.POINT, xy}
}
