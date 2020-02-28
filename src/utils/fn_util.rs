// use std::ops::FnOnce;
// trait Foo {
//   fn call(self, trigger: bool) -> Self;
// }

// struct Bar {
//   f: Option<dyn Fn() + 'static>,
// }

// impl Foo for Bar {
//   fn call(mut self, trigger: bool) -> Self {
//     if trigger && self.f.is_some() {
//       self.f.replace()();
//     }
//   }
// }

// pub fn never(trigger: bool) -> this {
//   never
// }

// pub fn once(f: fn()) {
//   let retry = |trigger: bool| {
//     if trigger {
//       f();
//       never
//     } else {
//       retry
//     }
//   }
// }

// fn retry(f: fn(), trigger: boolean) -> Fn(bool) {
//   if trigger {
//     f();
//     never
//   } else {
//     |trigger| retry(f, trigger)
//   }
// }
