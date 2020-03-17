struct FnTimes {
  fnc: fn(),
  times: usize,
}

impl FnTimes {
  pub fn new(fnc: fn(), times: usize) -> Self {
    Self { fnc, times }
  }

  pub fn call(&mut self) {
    if self.times > 0 {
      self.times -= 1;
      (self.fnc)();
    }
  }
}
