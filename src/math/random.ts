// https://gist.github.com/blixt/f17b47c62508be59987b

export class Random {
  /** @arg seed An integer. */
  constructor(private _seed: number) {
    this._seed = _seed % 0x7fff_ffff
    if (this._seed <= 0) this._seed += 0x7fff_fffe
  }

  /**
   * @arg seed An integer.
   * @return [min, max)
   */
  float(min: number = 0, max: number = 1): number {
    this._seed = (this._seed * 16807) % 0x7fff_ffff
    return min + ((max - min) * (this._seed - 1)) / 0x7fff_fffe
  }

  /**
   * @arg seed An integer.
   * @return An integer [min, max).
   */
  int(min = 0, max = Number.MAX_SAFE_INTEGER): number {
    return Math.floor(this.float(min, max))
  }
}
