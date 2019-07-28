import * as defaultKeyboardMap from '../../assets/inputs/default-keyboard-map.json'
import {InputBit} from '../input-bit'
import {KeyboardAdapter} from './keyboard-adapter'
import {Recorder} from '../recorder'

type Key = KeyboardEvent['key']
type KeyMap = Readonly<Partial<Record<Key, InputBit.Key>>>

export class KeyboardRecorder {
  constructor(
    private readonly _adapter: KeyboardAdapter = new KeyboardAdapter()
  ) {}

  record(recorder: Recorder): void {
    recorder.record(this._adapter.toInput())
  }

  reset(): void {
    this._adapter.reset()
  }

  /** Call this function when a keydown or keyup KeyboardEvent is received. */
  onKey(event: KeyboardEvent): void {
    const bit = (<KeyMap>defaultKeyboardMap)[event.key]
    if (bit === undefined) return
    this._adapter.adapt(InputBit[bit], event.type === 'keydown')
    event.preventDefault()
  }
}
