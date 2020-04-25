pub struct RGBA {
  pub r: f32,
  pub g: f32,
  pub b: f32,
  pub a: f32,
}

impl RGBA {
  pub fn from_components(r: u8, g: u8, b: u8, a: u8) -> Self {
    Self {
      r: f32::from(r) / 255.,
      g: f32::from(g) / 255.,
      b: f32::from(b) / 255.,
      a: f32::from(a) / 255.,
    }
  }
}

impl From<u32> for RGBA {
  fn from(val: u32) -> RGBA {
    RGBA::from_components(
      (val >> 24) as u8,
      (val >> 16) as u8,
      (val >> 8) as u8,
      (val >> 0) as u8,
    )
  }
}
