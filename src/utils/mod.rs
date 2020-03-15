#[macro_use]
pub mod assert;
pub mod array_util;
pub mod fn_util;

use std::rc::Rc;
pub type Millis = f64;

pub fn rc<T>(value: T) -> Rc<T> {
  Rc::new(value)
}

macro_rules! from_json {
  ($($json:tt)+) => {
    serde_json::from_value(serde_json::json!($($json)+))
  };
}
