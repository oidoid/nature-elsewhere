export enum Mask {
  LEFT = 0b0000_0001,
  RIGHT = 0b0000_0010,
  UP = 0b0000_0100,
  DOWN = 0b0000_1000,
  MENU = 0b0001_0000,
  DEBUG_CONTEXT_LOSS = 0b0010_0000
}

export type State = WriteState | ReadState
export class WriteState {
  set(input: Mask, active: boolean): WriteState {
    const sample = active ? this._sample | input : this._sample & ~input
    return new WriteState(
      this._sampleAge,
      sample,
      this._lastSample,
      this._combo
    )
  }

  read(step: number): ReadState {
    let sampleAge: number = this._sampleAge + step
    let combo: ReadonlyArray<number>
    if (this._sample && this._sample !== this._lastSample) {
      // Triggered.
      sampleAge = 0
      combo = [this._sample, ...this._combo]
    } else if (!this._sample && sampleAge > WriteState._maxSampleAge) {
      // Changed or expired.
      combo = [this._sample]
    } else {
      // No change.
      combo = this._combo
    }
    return new ReadState(
      sampleAge,
      this._sample,
      this._lastSample,
      combo.slice(0, WriteState._maxComboLength)
    )
  }

  constructor(
    private readonly _sampleAge: number = 0,
    private readonly _sample: number = 0,
    private readonly _lastSample: number = 0,
    private readonly _combo: ReadonlyArray<number> = []
  ) {}

  private static readonly _maxComboLength: number = 8
  private static readonly _maxSampleAge: number = 200
}

export class ReadState {
  left(triggered: boolean = false): boolean {
    return this.input(Mask.LEFT, triggered)
  }

  right(triggered: boolean = false): boolean {
    return this.input(Mask.RIGHT, triggered)
  }

  up(triggered: boolean = false): boolean {
    return this.input(Mask.UP, triggered)
  }

  down(triggered: boolean = false): boolean {
    return this.input(Mask.DOWN, triggered)
  }

  menu(triggered: boolean = false): boolean {
    return this.input(Mask.MENU, triggered)
  }

  debugContextLoss(triggered: boolean = false): boolean {
    return this.input(Mask.DEBUG_CONTEXT_LOSS, triggered)
  }

  combo(triggered: boolean = false, ...inputs: Mask[]): boolean {
    if (triggered && this._sampleAge) return false
    return inputs.every(
      (input, i) => this._combo[inputs.length - 1 - i] === input
    )
  }

  write(): WriteState {
    return new WriteState(
      this._sampleAge,
      this._sample, // _sample starts as previous _sample, key up events will clear.
      this._sample, // _sample becomes new _lastSample.
      this._combo
    )
  }

  constructor(
    private readonly _sampleAge: number,
    private readonly _sample: number,
    private readonly _lastSample: number,
    private readonly _combo: ReadonlyArray<number>
  ) {}

  private input(input: number, triggered: boolean): boolean {
    if (
      triggered &&
      (this._sampleAge ||
        ((input & this._sample) === input &&
          (input & this._sample) === (input & this._lastSample)))
    )
      return false
    return (input & this._sample) === input
  }
}
