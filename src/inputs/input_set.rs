use super::input::Input;
use crate::math::Millis;

#[derive(Clone)]
pub struct InputSet {
  pub point: Option<Input>,
  pub pick: Option<Input>,
}

impl InputSet {
  pub fn new() -> Self {
    Self { point: None, pick: None }
  }

  pub fn update(&mut self, elapsed: Millis) {
    self.point.as_mut().map(|input| input.update(elapsed));
    self.pick.as_mut().map(|input| input.update(elapsed));
  }

  pub fn any_active(&self) -> bool {
    self.point.as_ref().map_or(false, |input| input.active)
      || self.pick.as_ref().map_or(false, |input| input.active)
  }
}
