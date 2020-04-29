use crate::atlas::Atlas;
use crate::components::{Bounds, MaxSize, Renderable, Text};
use crate::graphics::Renderer;
use crate::graphics::Viewport;
use crate::resources::Timing;
use crate::sprites::Sprite;
use specs::prelude::{ResourceId, SystemData};
use specs::Join;
use specs::{ReadExpect, ReadStorage, System, World};
use std::cell::RefCell;
use std::rc::Rc;
use web_sys::console;

pub struct RendererSystem;

#[derive(SystemData)]
pub struct RenderData<'a> {
  atlas: ReadExpect<'a, Rc<Atlas>>,
  timing: ReadExpect<'a, Timing>,
  renderer: ReadExpect<'a, Rc<RefCell<Renderer>>>,
  viewport: ReadExpect<'a, Viewport>,
  // bounds: ReadStorage<'a, Bounds>,
  // text: ReadStorage<'a, Text>,
  // max_size: ReadStorage<'a, MaxWH>,
  sprites: ReadStorage<'a, Renderable<String>>,
}

impl<'a> System<'a> for RendererSystem {
  type SystemData = RenderData<'a>;

  fn run(&mut self, data: Self::SystemData) {
    let RenderData {
      atlas,
      timing,
      renderer,
      viewport,
      // bounds,
      // text,
      // max_size,
      sprites,
    } = data;

    let mut bin_config = bincode::config();
    bin_config.native_endian();
    let bytes: Vec<u8> = (&sprites).join().fold(vec![], |mut bytes, sprite| {
      for sprite in &sprite.sprites["Default"] {
        bytes.append(&mut sprite.serialize(&mut bin_config, &atlas).unwrap());
      }
      bytes
    });

    let mut renderer = renderer.borrow_mut();
    renderer.render(
      timing.play_time.as_secs_f32(),
      &viewport.canvas_size,
      viewport.scale,
      &viewport.cam,
      &bytes,
    );

    // for (bounds, text, max_size) in (&bounds, &text, (&max_size).maybe()).join() {
    //   console::log_1(
    //     &format!(
    //       "Hello {:?} {} {} {:?}",
    //       &bounds,
    //       timing.delta,
    //       text.0,
    //       max_size.unwrap_or(&MaxWH(WH16::from(255, 255))).0
    //     )
    //     .into(),
    //   );
    // }
  }
}
