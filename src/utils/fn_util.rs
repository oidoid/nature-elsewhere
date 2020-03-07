// https://specs.amethyst.rs/docs/tutorials/11_advanced_component.html
// https://docs.rs/specs/0.16.1/specs/trait.Component.html
// https://github.com/rust-lang-nursery/lazy-static.rs
// https://docs.serde.rs/serde_json/macro.json.html
// https://serde.rs/field-attrs.html

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
