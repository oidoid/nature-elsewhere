import {InputBit} from './input-bit'

export class Recorder {
  private state: ReadState | WriteState = new WriteState()

  write(): void {
    if (this.state instanceof ReadState) this.state = this.state.write()
  }

  set(input: number, active: boolean, xy?: XY): void {
    if (this.state instanceof ReadState) this.state = this.state.write()
    this.state = this.state.set(input, active, xy)
  }

  read(milliseconds: number): void {
    if (this.state instanceof WriteState) {
      this.state = this.state.read(milliseconds)
    }
  }

  left(triggered: boolean = false): boolean {
    return this.active(InputBit.LEFT, triggered)
  }

  right(triggered: boolean = false): boolean {
    return this.active(InputBit.RIGHT, triggered)
  }

  up(triggered: boolean = false): boolean {
    return this.active(InputBit.UP, triggered)
  }

  down(triggered: boolean = false): boolean {
    return this.active(InputBit.DOWN, triggered)
  }

  action(triggered: boolean = false): boolean {
    return this.active(InputBit.ACTION, triggered)
  }

  menu(triggered: boolean = false): boolean {
    return this.active(InputBit.MENU, triggered)
  }

  debugContextLoss(triggered: boolean = false): boolean {
    return this.active(InputBit.DEBUG_CONTEXT_LOSS, triggered)
  }

  scaleReset(triggered: boolean = false): boolean {
    return this.active(InputBit.SCALE_RESET, triggered)
  }

  scaleIncrease(triggered: boolean = false): boolean {
    return this.active(InputBit.SCALE_INCREASE, triggered)
  }

  scaleDecrease(triggered: boolean = false): boolean {
    return this.active(InputBit.SCALE_DECREASE, triggered)
  }

  move(triggered: boolean = false): XY | undefined {
    return this.state instanceof ReadState &&
      this.active(InputBit.POINT, triggered)
      ? this.state.positions()[0]
      : undefined
  }

  pick(triggered: boolean = false): XY | undefined {
    return this.state instanceof ReadState &&
      this.active(InputBit.PICK, triggered)
      ? this.state.positions()[0]
      : undefined
  }

  prevEntity(triggered: boolean = false): boolean {
    return this.active(InputBit.PREV_ENTITY, triggered)
  }

  nextEntity(triggered: boolean = false): boolean {
    return this.active(InputBit.NEXT_ENTITY, triggered)
  }

  combo(triggered: boolean = false, ...inputs: number[]): boolean {
    return (
      this.state instanceof ReadState && this.state.combo(triggered, ...inputs)
    )
  }

  active(input: number, triggered: boolean): boolean {
    return (
      this.state instanceof ReadState && this.state.active(input, triggered)
    )
  }
}

class WriteState {
  static maxComboLength: number = 64
  static maxSampleAge: number = 500

  constructor(
    /** The age of the current sample. Cleared on nonzero triggers. */
    private readonly _sampleAge: number = 0,
    /** The current sample and initial state of the next sample. */
    private readonly _sample: number = 0,
    private readonly _lastSample: number = 0,
    /** The sample within a write. Cleared on read. This sample's initial state
        from a read is 0. */
    private readonly _currentRead: number = 0,
    /** Historical record of triggered nonzero samples. */
    private readonly _combo: ReadonlyArray<number> = [],
    /** Historical record of positions. */
    private readonly _positions: ReadonlyArray<XY | undefined> = []
  ) {}

  set(input: InputBit, active: boolean, xy?: XY): WriteState {
    if ((input & this._currentRead) === input) return this

    const currentRead = this._currentRead | (active ? input : 0)
    const sample = active ? this._sample | input : this._sample & ~input
    const positions = xy ? [xy, , ...this._positions] : this._positions
    return new WriteState(
      this._sampleAge,
      sample,
      this._lastSample,
      currentRead,
      this._combo,
      positions
    )
  }

  read(milliseconds: number): ReadState {
    let sampleAge = this._sampleAge + milliseconds
    let positions = this._positions
    let combo: ReadonlyArray<number>
    if (this._sample && this._sample !== this._lastSample) {
      // Triggered.
      sampleAge = 0
      combo = [this._sample, ...this._combo]
      positions = [this._positions[0], ...this._positions]
    } else if (!this._sample && sampleAge > WriteState.maxSampleAge) {
      // Released and expired.
      combo = []
      positions = []
    } else {
      // Unchanged (held or released).
      combo = this._combo
    }
    return new ReadState(
      sampleAge,
      this._sample,
      this._lastSample,
      combo.slice(0, WriteState.maxComboLength),
      positions.slice(0, combo.length)
    )
  }
}

class ReadState {
  constructor(
    private readonly _sampleAge: number,
    private readonly _sample: number,
    private readonly _lastSample: number,
    private readonly _combo: ReadonlyArray<number>,
    private readonly _positions: ReadonlyArray<XY | undefined>
  ) {}

  write(): WriteState {
    return new WriteState(
      this._sampleAge,
      this._sample, // _sample starts as previous _sample, key up events will clear.
      this._sample, // _sample becomes new _lastSample.
      0,
      this._combo,
      this._positions
    )
  }

  combo(triggered: boolean = false, ...inputs: number[]): boolean {
    if (triggered && this._sampleAge) return false
    return inputs.every(
      (input, i) => this._combo[inputs.length - 1 - i] === input
    )
  }

  active(input: number, triggered: boolean): boolean {
    const maskedSample = input & this._sample
    const maskedLastSample = input & this._lastSample
    if (triggered && (this._sampleAge || maskedSample === maskedLastSample)) {
      return false
    }
    return maskedSample === input
  }

  positions(): ReadonlyArray<XY | undefined> {
    return this._positions
  }
}
