#[macro_use]
pub mod assert;
pub mod array_util;
pub mod fn_util;

#[cfg(test)]
macro_rules! from_json {
  ($($json:tt)+) => {
    serde_json::from_value(serde_json::json!($($json)+))
  };
}
