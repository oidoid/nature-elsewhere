pub struct Settings {
  pub zoom: ZoomMultiplier,
  pub window_mode: WindowMode,
}

pub enum ZoomMultiplier {
  Max,
  Half,
  Min,
}

pub enum WindowMode {
  Fullscreen,
  Window,
}

impl Settings {
  pub fn default(dev: bool) -> Self {
    Self {
      zoom: ZoomMultiplier::Max,
      window_mode: if dev {
        WindowMode::Window
      } else {
        WindowMode::Fullscreen
      },
    }
  }
}
