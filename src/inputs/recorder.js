/** @typedef {WriteState | ReadState} Recorder */

/** @enum {number} */ // prettier-ignore
export const Mask = {
  LEFT:               0b0000000000001,
  RIGHT:              0b0000000000010,
  UP:                 0b0000000000100,
  DOWN:               0b0000000001000,
  MENU:               0b0000000010000,
  DEBUG_CONTEXT_LOSS: 0b0000000100000,
  SCALE_RESET:        0b0000001000000,
  SCALE_INCREASE:     0b0000010000000,
  SCALE_DECREASE:     0b0000100000000,
  POINT:              0b0001000000000,
  PICK:               0b0010000000000,
  PREV_ENTITY:        0b0100000000000,
  NEXT_ENTITY:        0b1000000000000
}

/** @type {number} */ const maxComboLength = 64
/** @type {number} */ const maxSampleAge = 500

export class WriteState {
  /**
   * @arg {number} [sampleAge]
   * @arg {number} [sample]
   * @arg {number} [lastSample]
   * @arg {ReadonlyArray<number>} [combo]
   * @arg {ReadonlyArray<XY|undefined>} [positions]
   */
  constructor(
    sampleAge = 0,
    sample = 0,
    lastSample = 0,
    combo = [],
    positions = []
  ) {
    /** @type {number} The age of the current sample. Cleared on nonzero
     *                 triggers. */ this._sampleAge = sampleAge
    /** @type {number} The current sample and initial state of the next sample.
     *                 */ this._sample = sample
    /** @type {number} */ this._lastSample = lastSample
    /** @type {ReadonlyArray<number>} Historical record of triggered nonzero
     *                                samples. */ this._combo = combo
    /** @type {ReadonlyArray<XY|undefined>} Historical record of positions.
     */ this._positions = positions
  }

  /**
   * @arg {Mask} input
   * @arg {boolean} active
   * @arg {XY} [xy]
   * @return {WriteState}
   */
  set(input, active, xy) {
    const sample = active ? this._sample | input : this._sample & ~input
    const positions = xy ? [xy, , ...this._positions] : this._positions
    return new WriteState(
      this._sampleAge,
      sample,
      this._lastSample,
      this._combo,
      positions
    )
  }

  /**
   * @arg {number} milliseconds
   * @return {ReadState}
   */
  read(milliseconds) {
    let sampleAge = this._sampleAge + milliseconds
    let positions = this._positions
    /** @type {ReadonlyArray<number>} */ let combo
    if (this._sample && this._sample !== this._lastSample) {
      // Triggered.
      sampleAge = 0
      combo = [this._sample, ...this._combo]
      positions = [this._positions[0], ...this._positions]
    } else if (!this._sample && sampleAge > maxSampleAge) {
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
      combo.slice(0, maxComboLength),
      positions.slice(0, combo.length)
    )
  }
}

export class ReadState {
  /**
   * @arg {number} sampleAge
   * @arg {number} sample
   * @arg {number} lastSample
   * @arg {ReadonlyArray<number>} combo
   * @arg {ReadonlyArray<XY|undefined>} positions
   */
  constructor(sampleAge, sample, lastSample, combo, positions) {
    /** @type {number} */ this._sampleAge = sampleAge
    /** @type {number} */ this._sample = sample
    /** @type {number} */ this._lastSample = lastSample
    /** @type {ReadonlyArray<number>} */ this._combo = combo
    /** @type {ReadonlyArray<XY|undefined>} */ this._positions = positions
  }

  /**
   * @arg {boolean} [triggered]
   * @return {boolean}
   */
  left(triggered = false) {
    return this._input(Mask.LEFT, triggered)
  }

  /**
   * @arg {boolean} [triggered]
   * @return {boolean}
   */
  right(triggered = false) {
    return this._input(Mask.RIGHT, triggered)
  }

  /**
   * @arg {boolean} [triggered]
   * @return {boolean}
   */
  up(triggered = false) {
    return this._input(Mask.UP, triggered)
  }

  /**
   * @arg {boolean} [triggered]
   * @return {boolean}
   */
  down(triggered = false) {
    return this._input(Mask.DOWN, triggered)
  }

  /**
   * @arg {boolean} [triggered]
   * @return {boolean}
   */
  menu(triggered = false) {
    return this._input(Mask.MENU, triggered)
  }

  /**
   * @arg {boolean} [triggered]
   * @return {boolean}
   */
  debugContextLoss(triggered = false) {
    return this._input(Mask.DEBUG_CONTEXT_LOSS, triggered)
  }

  /**
   * @arg {boolean} [triggered]
   * @return {boolean}
   */
  scaleReset(triggered = false) {
    return this._input(Mask.SCALE_RESET, triggered)
  }

  /**
   * @arg {boolean} [triggered]
   * @return {boolean}
   */
  scaleIncrease(triggered = false) {
    return this._input(Mask.SCALE_INCREASE, triggered)
  }

  /**
   * @arg {boolean} [triggered]
   * @return {boolean}
   */
  scaleDecrease(triggered = false) {
    return this._input(Mask.SCALE_DECREASE, triggered)
  }

  /**
   * @arg {boolean} [triggered]
   * @return {XY|undefined}
   */
  move(triggered = false) {
    return this._input(Mask.POINT, triggered) ? this._positions[0] : undefined
  }

  /**
   * @arg {boolean} [triggered]
   * @return {XY|undefined}
   */
  pick(triggered = false) {
    return this._input(Mask.PICK, triggered) ? this._positions[0] : undefined
  }

  /**
   * @arg {boolean} [triggered]
   * @return {boolean}
   */
  prevEntity(triggered = false) {
    return this._input(Mask.PREV_ENTITY, triggered)
  }

  /**
   * @arg {boolean} [triggered]
   * @return {boolean}
   */
  nextEntity(triggered = false) {
    return this._input(Mask.NEXT_ENTITY, triggered)
  }

  /**
   * @arg {boolean} [triggered]
   * @arg {...Mask} inputs
   * @return {boolean}
   */
  combo(triggered = false, ...inputs) {
    if (triggered && this._sampleAge) return false
    return inputs.every(
      (input, i) => this._combo[inputs.length - 1 - i] === input
    )
  }

  /** @return {WriteState} */
  write() {
    return new WriteState(
      this._sampleAge,
      this._sample, // _sample starts as previous _sample, key up events will clear.
      this._sample, // _sample becomes new _lastSample.
      this._combo,
      this._positions
    )
  }

  /**
   * @arg {number} input
   * @arg {boolean} triggered
   * @return {boolean}
   */
  _input(input, triggered) {
    const maskedSample = input & this._sample
    const maskedLastSample = input & this._lastSample
    if (triggered && (this._sampleAge || maskedSample === maskedLastSample)) {
      return false
    }
    return maskedSample === input
  }
}
