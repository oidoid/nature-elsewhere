use crate::components::FollowMouse;
use crate::components::Position;
use crate::graphics::Viewport;
use crate::inputs::InputSet;
use crate::resources::Timing; // does resources make sense? i am stuffing non-resource-only things in
use specs::Join;
use specs::{ReadExpect, ReadStorage, System, WriteExpect, WriteStorage};
use std::cell::RefCell;
use std::rc::Rc;

pub struct InputProcessorSystem;

// should i use request animation frame in on resume regardless of focus?
impl<'a> System<'a> for InputProcessorSystem {
  type SystemData = (
    ReadExpect<'a, Timing>,
    ReadExpect<'a, Viewport>,
    WriteExpect<'a, Rc<RefCell<InputSet>>>,
    ReadStorage<'a, FollowMouse>,
    WriteStorage<'a, Position>,
  );

  fn run(&mut self, data: Self::SystemData) {
    let (timing, viewport, input, mouse_followers, mut positions) = data;
    input.borrow_mut().update(timing.delta);

    if input.borrow().point.clone().map_or(true, |input| !input.active) {
      return;
    }
    let xy = input
      .borrow()
      .point
      .clone()
      .unwrap()
      .to_level_xy(&viewport.canvas_wh, &viewport.cam)
      .clone();

    for (_follower, position) in (&mouse_followers, &mut positions).join() {
      position.0 = xy.clone();
    }
  }
}
