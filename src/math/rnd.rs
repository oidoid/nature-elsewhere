// http://www.firstpr.com.au/dsp/rand31/
// https://jsperf.com/park-miller-vs-math-random
pub struct Random {
  seed: i32,
}

impl Random {
  /// seed An integer.
  pub fn new(seed: i32) -> Self {
    let mut seed = seed % 0x7fff_ffff; // [-0x7fff_fffe, 0x7fff_fffe]
    if seed <= 0 {
      seed += 0x7fff_ffff // [1, 0x7fff_ffff]
    }
    Self { seed }
  }

  /// Returns [0, 1)
  pub fn float(&mut self) -> f64 {
    f64::from(self.int()) / f64::from(0x7fff_fffe)
  }

  /// Returns an integer [0, 2^31 - 3].
  pub fn int(&mut self) -> i32 {
    // [1, 2^31 - 2] or [0x1, 0x7fff_fffe]
    self.seed = (self.seed * 16_807) % 0x7fff_ffff;
    self.seed - 1
  }
}
