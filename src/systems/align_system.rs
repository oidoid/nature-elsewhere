use crate::components::align::AlignTo;
use crate::components::{bounds::Bounds, max_wh::MaxWH, text::Text};
use crate::graphics::Renderer;
use crate::graphics::Viewport;
use crate::math::rect::{Rect, R16};
use crate::math::wh::WH16;
use crate::math::xy::XY16;
use crate::resources::Timing;
use crate::sprites::sprite::Sprite;
use crate::sprites::sprite_composition::SpriteComposition;
use num::traits::cast::ToPrimitive;
use specs::prelude::{ResourceId, SystemData};
use specs::Join;
use specs::{Read, ReadExpect, ReadStorage, System, World};
use std::cell::RefCell;
use std::ops::DerefMut;
use std::rc::Rc;
use web_sys::console;

pub struct AlignSystem;

impl<'a> System<'a> for AlignSystem {
  type SystemData = (ReadStorage<'a, AlignTo>);

  fn run(&mut self, data: Self::SystemData) {
    let (align_to) = data;

    // for (bounds, text, max_wh) in (&align_to, (&max_wh).maybe()).join() {
    //   console::log_1(
    //     &format!(
    //       "Hello {:?} {} {} {:?}",
    //       &bounds,
    //       timing.step,
    //       text.0,
    //       max_wh.unwrap_or(&MaxWH(WH16::from(255, 255))).0
    //     )
    //     .into(),
    //   );
    // }
  }
}
