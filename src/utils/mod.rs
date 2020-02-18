#[macro_use]
pub mod assert;

/// Although Aseprite milliseconds are a u16, actual time is fractional.
pub type Millis = f32;
