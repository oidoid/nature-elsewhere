use std::rc::Rc;

#[macro_use]
pub mod assert;
pub mod array_util;
pub mod fn_util;

/// Although Aseprite milliseconds are a u16, actual time is fractional.
pub type Millis = f32;

pub fn rc<T>(value: T) -> Rc<T> {
  Rc::new(value)
}

macro_rules! from_json {
  ($($json:tt)+) => {
    serde_json::from_value(serde_json::json!($($json)+))
  };
}
