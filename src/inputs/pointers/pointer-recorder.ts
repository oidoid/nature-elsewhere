import {InputBit} from '../input-bit'
import {InputSource} from '../input-source'
import {PointerInput} from './pointer-input'
import {Recorder} from '../recorder'
import {Rect} from '../../math/rect'
import {Viewport} from '../../graphics/viewport'
import {WH} from '../../math/wh'
import {ValueUtil} from '../../utils/value-util'

// this is incorrect. an asynchronous event to polled input pattern is needed here to give hte mouse behavior desired

export interface PointerRecorder {
  point?: PointerInput.Point
  pick?: PointerInput.Pick
}
type t = PointerRecorder

export namespace PointerRecorder {
  export const make = (): t => ({})

  export const record = (val: t, recorder: Recorder): void => {
    const inputs = [val.pick, val.point].filter(ValueUtil.is)
    inputs.forEach(input => Recorder.record(recorder, input))
  }

  export const reset = (val: t): void => {
    ;(val.point = undefined), (val.pick = undefined)
  }

  export const onEvent = (
    val: t,
    canvasWH: WH,
    cam: Rect,
    ev: PointerEvent
  ): void => {
    if (canvasWH.w && canvasWH.h) {
      if ((!val.pick || !val.pick.bits) && ev.type === 'pointermove')
        val.point = point(canvasWH, cam, ev)
      else (val.pick = pick(canvasWH, cam, ev)), delete val.point
    }
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
