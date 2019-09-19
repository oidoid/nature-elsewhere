import {InputBit} from '../input-bit/input-bit'
import {InputSource} from '../input-source/input-source'
import {PointerInput} from './pointer-input'
import {Rect} from '../../math/rect/rect'
import {Viewport} from '../../graphics/viewport'
import {WH} from '../../math/wh/wh'

// For 'pointermove', 'pointerup', 'pointerdown', 'pointercancel' Event types.
export interface PointRecorder {
  point?: PointerInput.Point
}

export namespace PointRecorder {
  export function make(): PointRecorder {
    return {point: undefined}
  }

  export function onEvent(
    recorder: PointRecorder,
    canvasWH: WH,
    cam: Rect,
    event: PointerEvent
  ): void {
    recorder.point = eventToPoint(event, canvasWH, cam)
    event.preventDefault()
  }
}

/**
 * Converts a PointerEvent to a pointer record.
 * @arg canvasWH The viewport dimensions in window pixels.
 * @arg cam The coordinates and dimensions of the camera the input was made
 *          through in level pixels.
 */
function eventToPoint(
  {type, clientX, clientY}: PointerEvent,
  canvasWH: WH,
  cam: Rect
): Maybe<PointerInput.Point> {
  if (!canvasWH.w || !canvasWH.h || type === 'pointercancel') return undefined
  const xy = Viewport.toLevelXY({x: clientX, y: clientY}, canvasWH, cam)
  const active = type === 'pointermove' || type === 'pointerdown'
  const bits = active ? InputBit.POINT : 0
  return {source: InputSource.POINTER_POINT, bits, xy}
}
