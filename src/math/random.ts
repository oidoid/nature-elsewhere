// http://www.firstpr.com.au/dsp/rand31/
// https://jsperf.com/park-miller-vs-math-random
export class Random {
  /** @arg _seed An integer [-2^31 + 3, 2^31 - 2] or [-0x7fff_fffd, 0x7fff_fffe]. */
  constructor(private _seed: number) {
    this._seed = _seed > 0 ? _seed % 0x7fff_ffff : _seed + 0x7fff_fffe
  }

  /** @return [min, max) */
  float(min: number = 0, max: number = 1): number {
    // [1, 2^31 - 1] or [0x1, 0x7fff_ffff]
    this._seed = (this._seed * 16807) % 0x7fff_ffff
    return min + (max - min) * ((this._seed - 1) / 0x7fff_fffe)
  }

  /** @return An integer [min, max). */
  int(min = 0, max = Number.MAX_SAFE_INTEGER): number {
    return Math.floor(this.float(min, max))
  }
}
