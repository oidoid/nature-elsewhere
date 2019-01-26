// https://gist.github.com/blixt/f17b47c62508be59987b
// http://www.firstpr.com.au/dsp/rand31/

export class Random {
  private seed: number
  constructor(seed = 0) {
    this.seed = seed % 2147483647
    if (this.seed <= 0) this.seed += 2147483646
  }

  /** @return {number} [min, max) */
  float(min = 0, max = 1) {
    this.seed = (this.seed * 16807) % 2147483647
    return min + ((max - min) * (this.seed - 1)) / 2147483646
  }

  /** @return {number} An integer [min, max). */
  int(min = 0, max = 2) {
    return Math.floor(this.float(min, max))
  }
}
