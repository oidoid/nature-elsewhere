import {PointerAdapter} from './pointer-adapter'
import {Recorder} from '../recorder'
import {Rect} from '../../math/rect'
import {WH} from '../../math/wh'

export class PointerRecorder {
  constructor(
    private readonly _adapter: PointerAdapter = new PointerAdapter()
  ) {}

  record(recorder: Recorder): void {
    this._adapter.toInput().forEach(input => Recorder.record(recorder, input))
  }

  reset(): void {
    this._adapter.reset()
  }

  onEvent(canvasWH: WH, cam: Rect, event: PointerEvent): void {
    this._adapter.adapt(canvasWH, cam, event)
    event.preventDefault()
  }
}
