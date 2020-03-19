use crate::components::player::Player;
use crate::inputs::InputSet;
use crate::resources::Timing;
use specs::Join;
use specs::{ReadExpect, ReadStorage, System, WriteExpect};
use std::cell::RefCell;
use std::rc::Rc;
use web_sys::console;

pub struct InputProcessorSystem;

impl<'a> System<'a> for InputProcessorSystem {
  type SystemData = (
    ReadExpect<'a, Timing>,
    WriteExpect<'a, Rc<RefCell<InputSet>>>,
    ReadStorage<'a, Player>,
  );

  fn run(&mut self, data: Self::SystemData) {
    let (timing, input, players) = data;
    input.borrow_mut().update(timing.delta);

    for player in (&players).join() {
      console::log_1(&format!("{:?}", *input,).into());
    }
  }
}
