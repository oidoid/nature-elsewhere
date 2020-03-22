use specs::prelude::DenseVecStorage;
use specs::Component;

#[derive(Component, Deserialize)]
pub struct Cursor {
  pub mode: CursorMode,
  pub icon: CursorIcon,
}

#[derive(Deserialize)]
pub enum CursorMode {
  Hidden,
  Point,
  Pick,
}

#[derive(Deserialize)]
pub enum CursorIcon {
  Dot,
  Reticle,
  Hand,
}

impl Cursor {
  pub fn new() -> Self {
    Self { mode: CursorMode::Hidden, icon: CursorIcon::Dot }
  }
}
