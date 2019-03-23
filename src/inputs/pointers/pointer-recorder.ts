import {PointerAdapter} from './pointer-adapter'
import {Recorder} from '../recorder'

export class PointerRecorder {
  constructor(
    private readonly _adapter: PointerAdapter = new PointerAdapter()
  ) {}

  record(recorder: Recorder): void {
    this._adapter.toInput().forEach(input => recorder.record(input))
  }

  onEvent(
    viewport: WH,
    cam: Rect,
    event: PointerEvent,
    defaultOrigin: XY
  ): void {
    this._adapter.adapt(viewport, cam, event, defaultOrigin)

    event.preventDefault()
  }
}
