#[macro_use]
pub mod assert;
pub mod fn_util;

/// Although Aseprite milliseconds are a u16, actual time is fractional.
pub type Millis = f32;
