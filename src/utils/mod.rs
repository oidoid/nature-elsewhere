#[macro_use]
pub mod assert;
pub mod array_util;
pub mod fn_util;

pub type Millis = f64;

macro_rules! from_json {
  ($($json:tt)+) => {
    serde_json::from_value(serde_json::json!($($json)+))
  };
}
