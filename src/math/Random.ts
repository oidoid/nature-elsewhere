// http://www.firstpr.com.au/dsp/rand31/
// https://jsperf.com/park-miller-vs-math-random
export class Random {
  private _seed: number

  /** @arg seed An integer. */
  constructor(seed: number) {
    this._seed = seed % 0x7fff_ffff // [-0x7fff_fffe, 0x7fff_fffe]
    if (this._seed <= 0) this._seed += 0x7fff_ffff // [1, 0x7fff_ffff]
  }

  /** @return [0, 1) */
  float(): number {
    return this.int() / 0x7fff_fffe
  }

  /** @return An integer [0, 2^31 - 3]. */
  int(): number {
    // [1, 2^31 - 2] or [0x1, 0x7fff_fffe]
    this._seed = (this._seed * 16_807) % 0x7fff_ffff
    return this._seed - 1
  }
}
