import {InputBit} from '../input-bit'
import {KeyboardAdapter} from './keyboard-adapter'
import {Recorder} from '../recorder'

type Key = KeyboardEvent['key']
type KeyMap = Readonly<Record<Key, InputBit>>

const defaultKeyMap: KeyMap = Object.freeze({
  ArrowLeft: InputBit.LEFT,
  a: InputBit.LEFT,
  ArrowRight: InputBit.RIGHT,
  d: InputBit.RIGHT,
  ArrowUp: InputBit.UP,
  w: InputBit.UP,
  ArrowDown: InputBit.DOWN,
  s: InputBit.DOWN,
  ' ': InputBit.ACTION,
  Enter: InputBit.ACTION,
  Escape: InputBit.MENU,
  p: InputBit.DEBUG_CONTEXT_LOSS,
  0: InputBit.SCALE_RESET,
  '-': InputBit.SCALE_DECREASE,
  '+': InputBit.SCALE_INCREASE,
  1: InputBit.PREV_ENTITY,
  2: InputBit.NEXT_ENTITY
})

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
    const bit = defaultKeyMap[event.key]
    if (bit === undefined) return

    this._adapter.adapt(bit, event.type === 'keydown')

    event.preventDefault()
  }
}
