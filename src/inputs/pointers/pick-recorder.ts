import {InputBit} from '../input-bit/input-bit'
import {InputSource} from '../input-source/input-source'
import {PointerInput} from './pointer-input'
import {Rect} from '../../math/rect/rect'
import {Viewport} from '../../graphics/viewport'
import {WH} from '../../math/wh/wh'

// For 'pointermove', 'pointerup', 'pointerdown', 'pointercancel' Event types.
export interface PickRecorder {
  pick?: PointerInput.Pick
}

export namespace PickRecorder {
  export function make(): PickRecorder {
    return {pick: undefined}
  }

  export function onEvent(
    recorder: PickRecorder,
    canvasWH: WH,
    cam: Rect,
    event: PointerEvent
  ): void {
    recorder.pick = eventToPick(event, recorder, canvasWH, cam)
    event.preventDefault()
  }
}

/**
 * Converts a PointerEvent to a pointer record.
 * @arg canvasWH The viewport dimensions in window pixels.
 * @arg cam The coordinates and dimensions of the camera the input was made
 *          through in level pixels.
 */
function eventToPick(
  {type, clientX, clientY}: PointerEvent,
  recorder: PickRecorder,
  canvasWH: WH,
  cam: Rect
): Maybe<PointerInput.Pick> {
  if (!canvasWH.w || !canvasWH.h || type === 'pointercancel') return undefined
  const xy = Viewport.toLevelXY({x: clientX, y: clientY}, canvasWH, cam)
  const active =
    type === 'pointerdown' ||
    (recorder.pick &&
      recorder.pick.bits === InputBit.PICK &&
      type === 'pointermove')
  const bits = active ? InputBit.PICK : 0
  console.log(type, bits)
  return {source: InputSource.POINTER_PICK, bits, xy}
}
