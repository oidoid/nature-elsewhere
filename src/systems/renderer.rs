use crate::components::{bounds::Bounds, max_wh::MaxWH, text::Text};
use crate::graphics::renderer::Renderer;
use crate::graphics::viewport::Viewport;
use crate::math::rect::{Rect, R16};
use crate::math::wh::WH16;
use crate::math::xy::XY16;
use crate::resources::Timing;
use crate::sprites::sprite::Sprite;
use crate::sprites::sprite_composition::SpriteComposition;
use specs::prelude::{ResourceId, SystemData};
use specs::Join;
use specs::{ReadExpect, ReadStorage, System, World};
use std::cell::RefCell;
use std::rc::Rc;
use web_sys::console;

pub struct RendererSystem;

#[derive(SystemData)]
pub struct RenderData<'a> {
  timing: ReadExpect<'a, Timing>,
  renderer: ReadExpect<'a, Rc<RefCell<Renderer>>>,
  viewport: ReadExpect<'a, Viewport>,
  bounds: ReadStorage<'a, Bounds>,
  text: ReadStorage<'a, Text>,
  max_wh: ReadStorage<'a, MaxWH>,
}

impl<'a> System<'a> for RendererSystem {
  type SystemData = RenderData<'a>;

  fn run(&mut self, data: Self::SystemData) {
    let RenderData { timing, renderer, viewport, bounds, text, max_wh } = data;

    let bytes = [
      Sprite::new(
        R16::cast_wh(80, 150, 11, 13),
        R16::cast_wh(80, 150, 11, 13),
        SpriteComposition::Source,
        R16::cast_wh(32, 32, 11, 13),
        XY16 { x: 1, y: 1 },
        XY16 { x: 0, y: 0 },
        XY16 { x: 0, y: 0 },
      ),
      // Cool grass shader
      Sprite::new(
        R16::cast_wh(80, 240, 16, 16),
        R16::cast_wh(80, 240, 16, 16),
        SpriteComposition::Source,
        R16::cast_wh(32, 32, 160, 160),
        XY16 { x: 1, y: 1 },
        XY16 { x: 0, y: 0 },
        XY16 { x: 0, y: 0 },
      ),
      Sprite::new(
        R16::cast_wh(48, 240, 32, 16),
        R16::cast_wh(16, 240, 32, 16),
        SpriteComposition::SourceIn,
        R16::cast_wh(48, 48, 32, 16),
        XY16 { x: 1, y: 1 },
        XY16 { x: 0, y: 0 },
        XY16 { x: -64, y: 32 },
      ),
      Sprite::new(
        R16::cast_wh(48, 240, 24, 16),
        R16::cast_wh(16, 240, 24, 16),
        SpriteComposition::SourceIn,
        R16::cast_wh(55, 40, 24, 16),
        XY16 { x: 1, y: 1 },
        XY16 { x: -64, y: 32 },
        XY16 { x: -64, y: 32 },
      ),
    ];
    let bytes = bincode::config().native_endian().serialize(&bytes).unwrap();

    let mut renderer = renderer.borrow_mut();
    renderer.render(
      timing.play_time.as_secs_f32(),
      &viewport.canvas_wh,
      viewport.scale,
      &Rect::cast(0, 0, viewport.cam_wh.w, viewport.cam_wh.h),
      &bytes,
    );

    for (bounds, text, max_wh) in (&bounds, &text, (&max_wh).maybe()).join() {
      console::log_1(
        &format!(
          "Hello {:?} {} {} {:?}",
          &bounds,
          timing.delta,
          text.0,
          max_wh.unwrap_or(&MaxWH(WH16::from(255, 255))).0
        )
        .into(),
      );
    }
  }
}
