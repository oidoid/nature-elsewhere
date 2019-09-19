import {PickRecorder} from './pick-recorder'
import {PointRecorder} from './point-recorder'
import {Recorder} from '../recorder/recorder'
import {ValueUtil} from '../../utils/value-util'
import {WH} from '../../math/wh/wh'
import {Rect} from '../../math/rect/rect'

// For 'pointermove', 'pointerup', 'pointerdown', 'pointercancel' Event types.
export interface PointerRecorder {
  readonly point: PointRecorder
  readonly pick: PickRecorder
}

export namespace PointerRecorder {
  export function make(): PointerRecorder {
    return {point: PointRecorder.make(), pick: PickRecorder.make()}
  }

  export function reset(recorder: PointerRecorder): void {
    recorder.point.point = undefined
    recorder.pick.pick = undefined
  }

  export function onEvent(
    recorder: PointerRecorder,
    canvasWH: WH,
    cam: Rect,
    event: PointerEvent
  ): void {
    PointRecorder.onEvent(recorder.point, canvasWH, cam, event)
    PickRecorder.onEvent(recorder.pick, canvasWH, cam, event)
  }

  export function record(
    pointerRecorder: PointerRecorder,
    recorder: Recorder
  ): void {
    ;[pointerRecorder.pick.pick, pointerRecorder.point.point]
      .filter(ValueUtil.is)
      .forEach(input => Recorder.record(recorder, input))
  }
}
