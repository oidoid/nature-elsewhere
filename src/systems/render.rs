use crate::components::resources::TimeStep;
use crate::components::{bounds::Bounds, max_wh::MaxWH, text::Text};
use crate::math::wh::WH16;
use specs::prelude::{ResourceId, SystemData};
use specs::Join;
use specs::{ReadExpect, ReadStorage, System, World};
use web_sys::console;

pub struct RenderSystem;

#[derive(SystemData)]
pub struct RenderData<'a> {
  time_step: ReadExpect<'a, TimeStep>,
  bounds: ReadStorage<'a, Bounds>,
  text: ReadStorage<'a, Text>,
  max_wh: ReadStorage<'a, MaxWH>,
}

impl<'a> System<'a> for RenderSystem {
  type SystemData = RenderData<'a>;

  fn run(&mut self, data: Self::SystemData) {
    let RenderData { time_step, bounds, text, max_wh } = data;
    for (bounds, text, max_wh) in (&bounds, &text, (&max_wh).maybe()).join() {
      console::log_1(
        &format!(
          "Hello {:?} {} {} {:?}",
          &bounds,
          time_step.0,
          text.0,
          max_wh.unwrap_or(&MaxWH(WH16::from(255, 255))).0
        )
        .into(),
      );
    }
  }
}
