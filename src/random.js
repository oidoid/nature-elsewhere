// https://gist.github.com/blixt/f17b47c62508be59987b
// http://www.firstpr.com.au/dsp/rand31/

/** @prop {number} _seed */
export class Random {
  /** @arg {number} seed */
  constructor(seed) {
    /** @type {number} */ this._seed = seed % 2147483647
    if (this._seed <= 0) this._seed += 2147483646
  }

  /**
   * @arg {number} [min]
   * @arg {number} [max]
   * @return {number} [min, max)
   */
  float(min = 0, max = 1) {
    this._seed = (this._seed * 16807) % 2147483647
    return min + ((max - min) * (this._seed - 1)) / 2147483646
  }

  /**
   * @arg {number} [min]
   * @arg {number} [max]
   * @return {number} An integer [min, max).
   */
  int(min, max) {
    return Math.floor(this.float(min, max))
  }
}
