use super::wh::WH;
use super::xy::XY;

#[derive(Debug, Deserialize, Eq, PartialEq)]
pub struct Rect<T, V> {
  pub xy: XY<T>,
  pub wh: WH<V>, // x: i32, // Center X position relative sprite bounds in pixels
                 // y: i32,
                 // w: u32,
                 // h: u32
}
// or use components?
pub type Rect16 = Rect<i16, u16>;
