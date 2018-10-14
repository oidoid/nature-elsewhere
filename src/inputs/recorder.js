/** @typedef {WriteState | ReadState} State */

/** @typedef {ValueOf<typeof Mask>} Mask */
export const Mask = {
  LEFT: 0b00000001,
  RIGHT: 0b00000010,
  UP: 0b00000100,
  DOWN: 0b00001000,
  MENU: 0b00010000,
  DEBUG_CONTEXT_LOSS: 0b00100000
}

/** @type {number} */ const maxComboLength = 8
/** @type {number} */ const maxSampleAge = 200

/**
 * @prop {number} _sampleAge The age of the current sample. Cleared on nonzero
 *                           triggers.
 * @prop {number} _sample The current sample and initial state of the next
 *                        sample.
 * @prop {number} _lastSample
 * @prop {ReadonlyArray<number>} _combo Historical record of triggered nonzero
 *                                      samples.
 */
export class WriteState {
  /**
   * @arg {number} [sampleAge]
   * @arg {number} [sample]
   * @arg {number} [lastSample]
   * @arg {ReadonlyArray<number>} [combo]
   */
  constructor(sampleAge = 0, sample = 0, lastSample = 0, combo = []) {
    this._sampleAge = sampleAge
    this._sample = sample
    this._lastSample = lastSample
    this._combo = combo
  }

  /**
   * @arg {Mask} input
   * @arg {boolean} active
   * @return {WriteState}
   */
  set(input, active) {
    const sample = active ? this._sample | input : this._sample & ~input
    return new WriteState(
      this._sampleAge,
      sample,
      this._lastSample,
      this._combo
    )
  }

  /**
   * @arg {number} step
   * @return {ReadState}
   */
  read(step) {
    let sampleAge = this._sampleAge + step
    /** @type {ReadonlyArray<number>} */ let combo
    if (this._sample && this._sample !== this._lastSample) {
      // Triggered.
      sampleAge = 0
      combo = [this._sample, ...this._combo]
    } else if (!this._sample && sampleAge > maxSampleAge) {
      // Released and expired.
      combo = []
    } else {
      // Unchanged (held or released).
      combo = this._combo
    }
    return new ReadState(
      sampleAge,
      this._sample,
      this._lastSample,
      combo.slice(0, maxComboLength)
    )
  }
}

/**
 * @prop {number} _sampleAge
 * @prop {number} _sample
 * @prop {number} _lastSample
 * @prop {ReadonlyArray<number>} _combo
 */
export class ReadState {
  /**
   * @arg {number} sampleAge
   * @arg {number} sample
   * @arg {number} lastSample
   * @arg {ReadonlyArray<number>} combo
   */
  constructor(sampleAge, sample, lastSample, combo) {
    this._sampleAge = sampleAge
    this._sample = sample
    this._lastSample = lastSample
    this._combo = combo
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
      this._combo
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
